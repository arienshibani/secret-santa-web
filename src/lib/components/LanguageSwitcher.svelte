<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentLanguage } from '$lib/i18n';
	import type { Language } from '$lib/utils/types';

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: 'en', label: 'English', flag: '🇬🇧' },
		{ code: 'nb', label: 'Norsk', flag: '🇳🇴' },
		{ code: 'nn', label: 'Nynorsk', flag: '🇳🇴' }
	];

	let isOpen = false;

	const handleChange = (lang: Language) => {
		currentLanguage.set(lang);
		isOpen = false;
	};

	const currentLang = languages.find((l) => l.code === $currentLanguage) || languages[0];

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	};

	$: if (isOpen && typeof window !== 'undefined') {
		window.addEventListener('click', handleClickOutside);
	} else if (typeof window !== 'undefined') {
		window.removeEventListener('click', handleClickOutside);
	}

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="language-switcher relative">
	<button
		type="button"
		class="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-md transition-all duration-200 font-medium text-sm border-2 border-red-200 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
		on:click={() => (isOpen = !isOpen)}
		aria-label="Select language"
		aria-expanded={isOpen}
	>
		<span class="text-lg">{currentLang.flag}</span>
		<span class="hidden sm:inline">{currentLang.label}</span>
		<svg
			class="w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-red-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
			role="menu"
		>
			{#each languages as lang}
				<button
					type="button"
					class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors {$currentLanguage === lang.code
						? 'bg-red-100 text-red-700 font-semibold'
						: 'text-gray-700'}"
					on:click={() => handleChange(lang.code)}
					role="menuitem"
				>
					<span class="text-xl">{lang.flag}</span>
					<span class="flex-1">{lang.label}</span>
					{#if $currentLanguage === lang.code}
						<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-in {
		animation: fade-in 0.2s ease-out;
	}
</style>

