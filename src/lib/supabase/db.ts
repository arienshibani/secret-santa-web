import { supabase } from './client';
import type { Participant, AdminConfig, ParticipantFormData } from '$lib/utils/types';

export const createParticipants = async (
	participants: ParticipantFormData[],
	eventName: string
): Promise<Participant[]> => {
	const { data, error } = await supabase
		.from('participants')
		.insert(
			participants.map((p) => ({
				event_name: eventName,
				name: p.name,
				email: p.email || null,
				sms: p.sms || null,
				token: crypto.randomUUID(),
				gift_ready: false
			}))
		)
		.select();

	if (error) throw error;
	return data as Participant[];
};

export const updateAssignments = async (
	assignments: { participantId: string; assignedToId: string }[]
): Promise<void> => {
	const updates = assignments.map((a) => ({
		id: a.participantId,
		assigned_to_id: a.assignedToId
	}));

	for (const update of updates) {
		const { error } = await supabase
			.from('participants')
			.update({ assigned_to_id: update.assigned_to_id })
			.eq('id', update.id);

		if (error) throw error;
	}
};

export const getParticipantByToken = async (token: string): Promise<Participant | null> => {
	const { data, error } = await supabase
		.from('participants')
		.select('*')
		.eq('token', token)
		.single();

	if (error || !data) return null;
	return data as Participant;
};

export const getAssignedParticipant = async (
	assignedToId: string
): Promise<Participant | null> => {
	const { data, error } = await supabase
		.from('participants')
		.select('*')
		.eq('id', assignedToId)
		.single();

	if (error || !data) return null;
	return data as Participant;
};

export const getAllParticipants = async (eventName: string): Promise<Participant[]> => {
	const { data, error } = await supabase
		.from('participants')
		.select('*')
		.eq('event_name', eventName)
		.order('created_at');

	if (error) throw error;
	return (data || []) as Participant[];
};

export const updateGiftStatus = async (participantId: string, giftReady: boolean): Promise<void> => {
	const { error } = await supabase
		.from('participants')
		.update({ gift_ready: giftReady })
		.eq('id', participantId);

	if (error) throw error;
};

export const getAdminConfig = async (eventName: string): Promise<AdminConfig | null> => {
	const { data, error } = await supabase
		.from('admin_config')
		.select('*')
		.eq('event_name', eventName)
		.single();

	if (error || !data) return null;
	return data as AdminConfig;
};

export const createAdminConfig = async (eventName: string, pin: string): Promise<AdminConfig> => {
	const { data, error } = await supabase
		.from('admin_config')
		.insert({ event_name: eventName, pin })
		.select()
		.single();

	if (error) throw error;
	return data as AdminConfig;
};

export const verifyAdminPin = async (eventName: string, pin: string): Promise<boolean> => {
	const config = await getAdminConfig(eventName);
	if (!config) return false;
	return config.pin === pin;
};

export const clearAllData = async (eventName: string): Promise<void> => {
	const { error: participantsError } = await supabase
		.from('participants')
		.delete()
		.eq('event_name', eventName);
	const { error: adminError } = await supabase
		.from('admin_config')
		.delete()
		.eq('event_name', eventName);

	if (participantsError) throw participantsError;
	if (adminError) throw adminError;
};

