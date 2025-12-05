<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import { createParticipants, updateAssignments, createAdminConfig, getAdminConfig } from '$lib/supabase/db';
	import { shuffleAssignments } from '$lib/utils/shuffle';
	import { getAssignmentUrl } from '$lib/utils/token';
	import type { ParticipantFormData, ContactMethod } from '$lib/utils/types';

	let eventName = '';
	let pin = '';
	let numParticipants = 0;
	let contactMethod: ContactMethod = 'email';
	let participants: ParticipantFormData[] = [];
	let errors: Record<number, Record<string, string>> = {};
	let loading = false;

	$: params = $page.url.searchParams;
	$: eventName = params.get('eventName') || '';
	$: pin = params.get('pin') || '';
	$: num = parseInt(params.get('numParticipants') || '0');
	$: method = params.get('contactMethod') as ContactMethod;

	$: {
		if (num && num >= 2 && method && eventName && pin) {
			// Only initialize if the array is empty or if the number/method changed
			if (participants.length === 0 || numParticipants !== num || contactMethod !== method) {
				numParticipants = num;
				contactMethod = method;
				participants = Array.from({ length: num }, () => ({
					name: '',
					email: contactMethod === 'email' || contactMethod === 'both' ? '' : undefined,
					sms: contactMethod === 'sms' || contactMethod === 'both' ? '' : undefined
				}));
			}
		} else if (params.has('numParticipants')) {
			goto('/');
		}
	}

	const validate = (): boolean => {
		errors = {};
		let valid = true;

		participants.forEach((p, i) => {
			const participantErrors: Record<string, string> = {};
			if (!p.name.trim()) {
				participantErrors.name = $t('step2.validation.nameRequired');
				valid = false;
			}
			if (contactMethod === 'email' && !p.email?.trim()) {
				participantErrors.email = $t('step2.validation.contactRequired');
				valid = false;
			}
			if (contactMethod === 'sms' && !p.sms?.trim()) {
				participantErrors.sms = $t('step2.validation.contactRequired');
				valid = false;
			}
			if (contactMethod === 'both' && !p.email?.trim() && !p.sms?.trim()) {
				participantErrors.contact = $t('step2.validation.contactRequired');
				valid = false;
			}
			if (Object.keys(participantErrors).length > 0) {
				errors[i] = participantErrors;
			}
		});

		return valid;
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!validate()) return;

		loading = true;
		try {
			// Create participants in database
			const created = await createParticipants(participants, eventName);

			// Shuffle assignments
			const assignments = shuffleAssignments(created);
			const assignmentArray = Array.from(assignments.entries()).map(([pid, aid]) => ({
				participantId: pid,
				assignedToId: aid
			}));

			// Update assignments in database
			await updateAssignments(assignmentArray);

			// Create admin config if it doesn't exist
			const existingConfig = await getAdminConfig(eventName);
			if (!existingConfig) {
				await createAdminConfig(eventName, pin);
			}

			// Navigate to results page with event name
			goto(`/results?eventName=${encodeURIComponent(eventName)}`);
		} catch (error) {
			console.error('Error creating participants:', error);
			alert('An error occurred. Please try again.');
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Participant Information 🎁</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-4xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-4xl md:text-5xl font-bold text-red-600 mb-2">
						{$t('step2.title')}
					</h1>
					<p class="text-gray-600 text-lg">{$t('step2.subtitle')}</p>
				</div>
				<LanguageSwitcher />
			</div>

			<form on:submit={handleSubmit} class="space-y-6">
				<div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
					{#each participants as participant, i}
						<div class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
							<h3 class="text-lg font-semibold text-gray-700 mb-3">
								{$t('step2.participant')} # {i + 1}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">
										{$t('step2.nameLabel')} *
									</label>
									<input
										type="text"
										bind:value={participant.name}
										placeholder={$t('step2.namePlaceholder')}
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
									/>
									{#if errors[i]?.name}
										<p class="mt-1 text-sm text-red-600">{errors[i].name}</p>
									{/if}
								</div>
								{#if contactMethod === 'email' || contactMethod === 'both'}
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">
											{$t('step2.emailLabel')} {contactMethod === 'email' ? '*' : ''}
										</label>
										<input
											type="email"
											bind:value={participant.email}
											placeholder={$t('step2.emailPlaceholder')}
											class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										/>
										{#if errors[i]?.email}
											<p class="mt-1 text-sm text-red-600">{errors[i].email}</p>
										{/if}
									</div>
								{/if}
								{#if contactMethod === 'sms' || contactMethod === 'both'}
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">
											{$t('step2.smsLabel')} {contactMethod === 'sms' ? '*' : ''}
										</label>
										<input
											type="tel"
											bind:value={participant.sms}
											placeholder={$t('step2.smsPlaceholder')}
											class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										/>
										{#if errors[i]?.sms}
											<p class="mt-1 text-sm text-red-600">{errors[i].sms}</p>
										{/if}
									</div>
								{/if}
								{#if errors[i]?.contact}
									<p class="mt-1 text-sm text-red-600">{errors[i].contact}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						on:click={() => goto('/')}
						class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
					>
						← {$t('common.back')}
					</button>
					<button
						type="submit"
						disabled={loading}
						class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
					>
						{loading ? $t('common.loading') : $t('common.submit')}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

