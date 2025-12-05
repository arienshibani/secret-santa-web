<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';

	let numParticipants = '';
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
		if (num > 1000) {
			errors.numParticipants = $t('step1.validation.participantsMax');
			return false;
		}
		return true;
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (!validate()) return;

		const params = new URLSearchParams({
			numParticipants
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
						max="1000"
						bind:value={numParticipants}
						placeholder={$t('step1.participantsPlaceholder')}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
					/>
					{#if errors.numParticipants}
						<p class="mt-1 text-sm text-red-600">{errors.numParticipants}</p>
					{/if}
				</div>

				<div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
					<h3 class="text-lg font-semibold text-blue-900 mb-3">
						{$t('step1.howItWorksTitle')}
					</h3>
					<div class="space-y-3 text-gray-700">
						<p>{$t('step1.howItWorks1')}</p>
						<p>{$t('step1.howItWorks2')}</p>
						<p>{$t('step1.howItWorks3')}</p>
					</div>
				</div>

				<button
					type="submit"
					class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
				>
					{$t('common.next')} →
				</button>
			</form>

			<div class="mt-8 text-center">
				<a
					href="/existing-event"
					class="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
				>
					{$t('step1.existingEventLink')}
				</a>
			</div>
		</div>
	</div>
</div>

