<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';

	$: status = $page.status || 404;
	$: message = $page.error?.message || 'Page not found';
</script>

<svelte:head>
	<title>{status === 404 ? '404 - Page Not Found' : 'Error'}</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-2xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 text-center">
			<div class="flex justify-end mb-6">
				<LanguageSwitcher />
			</div>

			<div class="space-y-6">
				<div class="text-8xl md:text-9xl font-bold text-red-600">{status}</div>

				{#if status === 404}
					<h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						Page Not Found ❄️
					</h1>
					<p class="text-xl text-gray-600 mb-8">
						The page you're looking for doesn't exist or has been moved.
					</p>
				{:else}
					<h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						Something went wrong 🎄
					</h1>
					<p class="text-xl text-gray-600 mb-8">{message}</p>
				{/if}

				<div class="text-4xl mb-8">🎄❄️🎁</div>

				<button
					type="button"
					on:click={() => goto('/')}
					class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
				>
					Go Home 🏠
				</button>
			</div>
		</div>
	</div>
</div>

