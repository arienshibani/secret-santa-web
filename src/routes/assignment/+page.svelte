<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import { getParticipantByToken, getAssignedParticipant } from '$lib/supabase/db';
	import type { Participant } from '$lib/utils/types';

	let participant: Participant | null = null;
	let assignedTo: Participant | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		const token = $page.url.searchParams.get('token');
		if (!token) {
			error = $t('assignment.invalidToken');
			loading = false;
			return;
		}

		try {
			const p = await getParticipantByToken(token);
			if (!p) {
				error = $t('assignment.invalidToken');
				loading = false;
				return;
			}

			participant = p;

			if (p.assigned_to_id) {
				const assigned = await getAssignedParticipant(p.assigned_to_id);
				assignedTo = assigned;
			}
		} catch (err) {
			console.error('Error loading assignment:', err);
			error = $t('assignment.invalidToken');
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Your Secret Santa Assignment 🎄</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-2xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 text-center">
			<div class="flex justify-end mb-6">
				<LanguageSwitcher />
			</div>

			{#if loading}
				<div class="py-12">
					<p class="text-xl text-gray-600">{$t('assignment.loading')}</p>
				</div>
			{:else if error || !participant || !assignedTo}
				<div class="py-12">
					<p class="text-2xl text-red-600 font-bold mb-4">❌</p>
					<p class="text-xl text-gray-800">{error || $t('assignment.invalidToken')}</p>
				</div>
			{:else}
				<div class="space-y-6">
					<h1 class="text-5xl md:text-6xl font-bold text-red-600 mb-4">
						{$t('assignment.title')}
					</h1>

					<div class="bg-red-50 rounded-lg p-6 mb-6">
						<p class="text-lg text-gray-700 mb-2">
							{$t('assignment.greeting', { name: participant.name })}
						</p>
					</div>

					<div class="bg-green-50 rounded-lg p-8 border-4 border-green-400">
						<p class="text-xl text-gray-700 mb-4">{$t('assignment.assignedTo')}</p>
						<p class="text-4xl md:text-5xl font-bold text-green-700">
							{assignedTo.name} 🎁
						</p>
					</div>

					<div class="text-4xl mt-8">🎄🎅⭐</div>
				</div>
			{/if}
		</div>
	</div>
</div>

