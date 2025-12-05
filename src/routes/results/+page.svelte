<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import { getAllParticipants, getAdminConfig } from '$lib/supabase/db';
	import { getAssignmentUrl } from '$lib/utils/token';
	import type { Participant, AssignmentResult } from '$lib/utils/types';

	let eventName = '';
	let participants: Participant[] = [];
	let assignments: AssignmentResult[] = [];
	let copiedIndex: number | null = null;
	let adminPin: string | null = null;

	$: eventName = $page.url.searchParams.get('eventName') || '';

	onMount(async () => {
		if (!eventName) {
			goto('/');
			return;
		}

		try {
			const all = await getAllParticipants(eventName);
			participants = all;

			// Build assignment results
			const results: AssignmentResult[] = [];
			for (const participant of all) {
				if (participant.assigned_to_id) {
					const assignedTo = all.find((p) => p.id === participant.assigned_to_id);
					if (assignedTo) {
						results.push({
							participant,
							assignedTo,
							url: getAssignmentUrl(participant.token)
						});
					}
				}
			}
			assignments = results;

			// Get admin PIN
			const config = await getAdminConfig(eventName);
			if (config) {
				adminPin = config.pin;
			}
		} catch (error) {
			console.error('Error loading participants:', error);
			alert('Error loading results. Please try again.');
		}
	});

	const copyToClipboard = async (url: string, index: number) => {
		try {
			await navigator.clipboard.writeText(url);
			copiedIndex = index;
			setTimeout(() => {
				copiedIndex = null;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	};
</script>

<svelte:head>
	<title>Assignments Ready! 🎅</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-4xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-4xl md:text-5xl font-bold text-red-600 mb-2">
						{$t('results.title')}
					</h1>
					<p class="text-gray-600 text-lg">{$t('results.subtitle')}</p>
				</div>
				<LanguageSwitcher />
			</div>

			<div class="space-y-4 mb-6">
				{#each assignments as assignment, i}
					<div class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
						<div class="flex flex-col md:flex-row md:items-center gap-3">
							<div class="flex-1">
								<p class="font-semibold text-lg text-gray-800">
									{assignment.participant.name}
								</p>
								<p class="text-sm text-gray-600 mt-1 break-all">{assignment.url}</p>
							</div>
							<button
								type="button"
								on:click={() => copyToClipboard(assignment.url, i)}
								class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
							>
								{copiedIndex === i ? $t('common.copied') : $t('results.copyUrl')}
							</button>
						</div>
					</div>
				{/each}
			</div>

			{#if adminPin}
				<div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
					<p class="text-sm text-gray-700 mb-2">
						<strong>Admin PIN:</strong> Save this PIN to access the admin dashboard later
					</p>
					<p class="text-2xl font-bold text-yellow-700 font-mono">{adminPin}</p>
				</div>
			{/if}

			<div class="flex gap-3">
				<button
					type="button"
					on:click={() => goto(`/admin/${eventName}`)}
					class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
				>
					{$t('results.adminLink')}
				</button>
			</div>
		</div>
	</div>
</div>

