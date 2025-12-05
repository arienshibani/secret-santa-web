<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import { verifyAdminPin } from '$lib/supabase/db';

	let eventName = '';
	let pin = '';
	let errors: Record<string, string> = {};
	let loading = false;

	const validate = (): boolean => {
		errors = {};

		if (!eventName || !eventName.trim()) {
			errors.eventName = $t('existingEvent.validation.eventNameRequired');
			return false;
		}

		if (!pin || pin.length !== 6) {
			errors.pin = pin.length === 0 ? $t('existingEvent.validation.pinRequired') : $t('existingEvent.validation.pinLength');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!validate()) return;

		loading = true;
		try {
			const valid = await verifyAdminPin(eventName.trim(), pin);
			if (valid) {
				goto(`/admin/${eventName.trim()}`);
			} else {
				errors.pin = $t('existingEvent.validation.invalidCredentials');
			}
		} catch (error) {
			console.error('Error verifying PIN:', error);
			errors.pin = $t('existingEvent.validation.invalidCredentials');
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Access Existing Event 🎄</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-2xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-4xl md:text-5xl font-bold text-red-600 mb-2">
						{$t('existingEvent.title')}
					</h1>
					<p class="text-gray-600 text-lg">{$t('existingEvent.subtitle')}</p>
				</div>
				<LanguageSwitcher />
			</div>

			<form on:submit={handleSubmit} class="space-y-6">
				<div>
					<label for="eventName" class="block text-sm font-medium text-gray-700 mb-2">
						{$t('existingEvent.eventNameLabel')}
					</label>
					<input
						id="eventName"
						type="text"
						bind:value={eventName}
						placeholder={$t('step1.eventNamePlaceholder')}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
					/>
					{#if errors.eventName}
						<p class="mt-1 text-sm text-red-600">{errors.eventName}</p>
					{/if}
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						{$t('existingEvent.pinLabel')}
					</label>
					<PinInput bind:value={pin} length={6} />
					{#if errors.pin}
						<p class="mt-1 text-sm text-red-600">{errors.pin}</p>
					{/if}
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						on:click={() => goto('/')}
						class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
					>
						{$t('common.back')}
					</button>
					<button
						type="submit"
						disabled={loading}
						class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
					>
						{loading ? $t('common.loading') : $t('existingEvent.submit')}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

