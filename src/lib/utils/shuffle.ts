import type { Participant } from './types';

export const shuffleAssignments = (participants: Participant[]): Map<string, string> => {
	if (participants.length < 2) {
		throw new Error('Need at least 2 participants');
	}

	const assignments = new Map<string, string>();
	const shuffled = [...participants];
	
	// Fisher-Yates shuffle
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	// Assign each person to the next in the shuffled array (circular)
	for (let i = 0; i < participants.length; i++) {
		const participant = participants[i];
		const assignedTo = shuffled[(i + 1) % shuffled.length];
		
		// Ensure no self-assignment
		if (participant.id === assignedTo.id) {
			// If self-assignment, swap with previous
			const prevIndex = (i - 1 + participants.length) % participants.length;
			assignments.set(participant.id, shuffled[prevIndex].id);
		} else {
			assignments.set(participant.id, assignedTo.id);
		}
	}

	// Final check: ensure no self-assignments
	for (const [participantId, assignedToId] of assignments.entries()) {
		if (participantId === assignedToId) {
			// Find another participant to swap with
			for (const [otherId, otherAssigned] of assignments.entries()) {
				if (otherId !== participantId && otherAssigned !== participantId) {
					assignments.set(participantId, otherAssigned);
					assignments.set(otherId, assignedToId);
					break;
				}
			}
		}
	}

	return assignments;
};

