<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import { getParticipantEmoji } from '$lib/utils/emoji';
	import type { ParticipantFormData, ContactMethod } from '$lib/utils/types';

	let numParticipants = 0;
	let participants: ParticipantFormData[] = [];
	let errors: Record<number, Record<string, string>> = {};
	let loading = false;

	$: params = $page.url.searchParams;
	$: num = parseInt(params.get('numParticipants') || '0');

	let initialized = false;

	$: {
		if (num && num >= 2) {
			// Only initialize once when first loading the page
			if (!initialized && participants.length === 0) {
				numParticipants = num;
				participants = Array.from({ length: num }, () => ({
					name: '',
					email: '',
					sms: ''
				}));
				initialized = true;
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
			if (!p.name || !p.name.trim()) {
				participantErrors.name = $t('step2.validation.nameRequired');
				valid = false;
			}

			// Check if at least one contact method is provided
			const hasEmail = p.email && p.email.trim();
			const hasSms = p.sms && p.sms.trim();
			if (!hasEmail && !hasSms) {
				participantErrors.contact = $t('step2.validation.contactRequired');
				valid = false;
			}

			if (Object.keys(participantErrors).length > 0) {
				errors[i] = participantErrors;
			}
		});

		return valid;
	};

	const addParticipant = () => {
		participants = [
			...participants,
			{
				name: '',
				email: '',
				sms: ''
			}
		];
		numParticipants = participants.length;
	};

	const removeParticipant = (index: number) => {
		if (participants.length <= 2) {
			alert($t('step2.validation.minParticipants'));
			return;
		}
		participants = participants.filter((_, i) => i !== index);
		numParticipants = participants.length;
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (!validate()) return;

		// Store participant data in sessionStorage temporarily
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('participantData', JSON.stringify({
				participants,
				numParticipants
			}));
		}

		// Navigate to step 3 (event name and PIN)
		goto('/setup');
	};
</script>

<svelte:head>
	<title>Participants 🎁</title>
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
					<p class="text-gray-600 text-lg">{$t('step2.subtitle', { count: participants.length.toString() })}</p>
				</div>
				<LanguageSwitcher />
			</div>

			<form on:submit={handleSubmit} class="space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
					{#each participants as participant, i}
						<div class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 relative">
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
									{#if participant.name.trim()}
										<span class="text-2xl">{getParticipantEmoji(participant.name, i)}</span>
										<span>{participant.name.trim()}</span>
									{:else}
										<span class="text-2xl">{getParticipantEmoji('', i)}</span>
										<span>{$t('step2.participant')} #{i + 1}</span>
									{/if}
								</h3>
								{#if participants.length > 2}
									<button
										type="button"
										on:click={() => removeParticipant(i)}
										class="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 transition-colors"
										title="Remove participant"
										aria-label="Remove participant"
									>
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								{/if}
							</div>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">
										{$t('step2.nameLabel')} *
									</label>
									<input
										type="text"
										bind:value={participant.name}
										placeholder={$t('step2.namePlaceholder')}
										maxlength="50"
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
									/>
									<p class="mt-1 text-xs text-gray-500 text-right">
										{participant.name.length}/50
									</p>
									{#if errors[i]?.name}
										<p class="mt-1 text-sm text-red-600">{errors[i].name}</p>
									{/if}
								</div>
								<div>
									<label for="email-{i}" class="block text-sm font-medium text-gray-700 mb-1">
										{$t('step2.emailLabel')}
									</label>
									<input
										id="email-{i}"
										type="email"
										bind:value={participant.email}
										placeholder={$t('step2.emailPlaceholder')}
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
									/>
									{#if errors[i]?.email}
										<p class="mt-1 text-sm text-red-600">{errors[i].email}</p>
									{/if}
								</div>
								<div>
									<label for="sms-{i}" class="block text-sm font-medium text-gray-700 mb-1">
										{$t('step2.smsLabel')}
									</label>
									<input
										id="sms-{i}"
										type="tel"
										bind:value={participant.sms}
										placeholder={$t('step2.smsPlaceholder')}
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
									/>
									{#if errors[i]?.sms}
										<p class="mt-1 text-sm text-red-600">{errors[i].sms}</p>
									{/if}
								</div>
								{#if errors[i]?.contact}
									<p class="mt-1 text-sm text-red-600">{errors[i].contact}</p>
								{/if}
								{#if errors[i]?.contact}
									<p class="mt-1 text-sm text-red-600">{errors[i].contact}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div class="flex justify-start">
					<button
						type="button"
						on:click={addParticipant}
						class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						{$t('step2.addParticipant')}
					</button>
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

