<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import type { ContactMethod } from '$lib/utils/types';

	let numParticipants = '';
	let contactMethod: ContactMethod | '' = '';
	let errors: Record<string, string> = {};

	const validate = (): boolean => {
		errors = {};

		if (!numParticipants) {
			errors.numParticipants = $t('step1.validation.participantsRequired');
			return false;
		}
		const num = parseInt(numParticipants);
		if (isNaN(num) || num < 2) {
			errors.numParticipants = $t('step1.validation.participantsMin');
			return false;
		}
		if (!contactMethod) {
			errors.contactMethod = $t('step1.validation.contactMethodRequired');
			return false;
		}
		return true;
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (!validate()) return;

		const params = new URLSearchParams({
			numParticipants,
			contactMethod
		});
		goto(`/participants?${params.toString()}`);
	};
</script>

<svelte:head>
	<title>Secret Santa  🎄</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-2xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-4xl md:text-5xl font-bold text-red-600 mb-2">
						{$t('step1.title')}
					</h1>
					<p class="text-gray-600 text-lg">{$t('step1.subtitle')}</p>
				</div>
				<LanguageSwitcher />
			</div>

			<form on:submit={handleSubmit} class="space-y-6">
				<div>
					<label for="numParticipants" class="block text-sm font-medium text-gray-700 mb-2">
						{$t('step1.participantsLabel')}
					</label>
					<input
						id="numParticipants"
						type="number"
						min="2"
						bind:value={numParticipants}
						placeholder={$t('step1.participantsPlaceholder')}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
					/>
					{#if errors.numParticipants}
						<p class="mt-1 text-sm text-red-600">{errors.numParticipants}</p>
					{/if}
				</div>

				<div>
					<fieldset>
						<legend class="block text-sm font-medium text-gray-700 mb-3">
							{$t('step1.contactMethodLabel')}
						</legend>
					<div class="space-y-2">
						<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors {contactMethod === 'sms'
							? 'border-red-500 bg-red-50'
							: 'border-gray-300'}">
							<input
								type="radio"
								name="contactMethod"
								value="sms"
								bind:group={contactMethod}
								class="mr-3"
							/>
							<span class="text-lg">📱 {$t('step1.contactMethodSMS')}</span>
						</label>
						<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors {contactMethod === 'email'
							? 'border-red-500 bg-red-50'
							: 'border-gray-300'}">
							<input
								type="radio"
								name="contactMethod"
								value="email"
								bind:group={contactMethod}
								class="mr-3"
							/>
							<span class="text-lg">✉️ {$t('step1.contactMethodEmail')}</span>
						</label>
						<label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors {contactMethod === 'both'
							? 'border-red-500 bg-red-50'
							: 'border-gray-300'}">
							<input
								type="radio"
								name="contactMethod"
								value="both"
								bind:group={contactMethod}
								class="mr-3"
							/>
							<span class="text-lg">📱✉️ {$t('step1.contactMethodBoth')}</span>
						</label>
					</div>
					{#if errors.contactMethod}
						<p class="mt-1 text-sm text-red-600">{errors.contactMethod}</p>
					{/if}
					</fieldset>
				</div>

				<button
					type="submit"
					class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
				>
					{$t('common.next')} →
				</button>
			</form>
		</div>
	</div>
</div>

