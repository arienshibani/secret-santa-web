<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SnowEffect from '$lib/components/SnowEffect.svelte';
	import ShowAssigneesDialog from '$lib/components/ShowAssigneesDialog.svelte';
	import {
		getAllParticipants,
		verifyAdminPin,
		getAdminConfig,
		updateGiftStatus,
		clearAllData
	} from '$lib/supabase/db';
	import { getAssignmentUrl } from '$lib/utils/token';
	import type { Participant } from '$lib/utils/types';

	let eventName = '';
	let authenticated = false;
	let pin = '';
	let pinError = false;
	let participants: Participant[] = [];
	let showAssignees = false;
	let showClearDialog = false;
	let loading = false;
	let copiedIndex: number | null = null;

	$: eventName = $page.params.eventName || '';

	$: {
		if (eventName && !authenticated) {
			// Event name is available, ready for PIN entry
		} else if (!eventName) {
			goto('/');
		}
	}

	const loadParticipants = async () => {
		if (!eventName) return;
		try {
			const all = await getAllParticipants(eventName);
			participants = all;
		} catch (error) {
			console.error('Error loading participants:', error);
		}
	};

	const handleLogin = async () => {
		pinError = false;
		if (!pin || !eventName) return;

		try {
			const valid = await verifyAdminPin(eventName, pin);
			if (valid) {
				authenticated = true;
				await loadParticipants();
			} else {
				pinError = true;
			}
		} catch (error) {
			console.error('Error verifying PIN:', error);
			pinError = true;
		}
	};

	const handleShowAssignees = () => {
		showAssignees = true;
	};

	const handleGiftStatusChange = async (participantId: string, checked: boolean) => {
		try {
			await updateGiftStatus(participantId, checked);
			await loadParticipants();
		} catch (error) {
			console.error('Error updating gift status:', error);
			alert('Error updating gift status');
		}
	};

	const handleClearData = async () => {
		if (!eventName) return;
		loading = true;
		try {
			await clearAllData(eventName);
			participants = [];
			authenticated = false;
			pin = '';
			showClearDialog = false;
			alert('All data cleared successfully');
			goto('/');
		} catch (error) {
			console.error('Error clearing data:', error);
			alert('Error clearing data');
		} finally {
			loading = false;
		}
	};

	const getAssignedToName = (participant: Participant): string | null => {
		if (!showAssignees || !participant.assigned_to_id) return null;
		const assigned = participants.find((p) => p.id === participant.assigned_to_id);
		return assigned?.name || null;
	};

	const getContactInfo = (participant: Participant): string => {
		const parts: string[] = [];
		if (participant.email) parts.push(`📧 ${participant.email}`);
		if (participant.sms) parts.push(`📱 ${participant.sms}`);
		return parts.join(' | ') || 'No contact info';
	};

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
	<title>Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen relative z-10 flex items-center justify-center p-4">
	<SnowEffect />
	<div class="max-w-6xl w-full">
		<div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
			<div class="flex justify-between items-start mb-6">
				<div>
					<h1 class="text-4xl md:text-5xl font-bold text-red-600">{$t('admin.title')}</h1>
					{#if eventName}
						<p class="text-sm text-gray-600 mt-1">Event: {eventName}</p>
					{/if}
				</div>
				<LanguageSwitcher />
			</div>

			{#if !authenticated}
				<div class="max-w-md mx-auto">
					<div class="space-y-4">
						<label class="block text-sm font-medium text-gray-700">
							{$t('admin.pinPrompt')}
						</label>
						<input
							type="password"
							bind:value={pin}
							placeholder={$t('admin.pinPlaceholder')}
							on:keydown={(e) => e.key === 'Enter' && handleLogin()}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
						/>
						{#if pinError}
							<p class="text-sm text-red-600">{$t('admin.invalidPin')}</p>
						{/if}
						<button
							type="button"
							on:click={handleLogin}
							class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
						>
							{$t('admin.login')}
						</button>
					</div>
				</div>
			{:else}
				<div class="space-y-6">
					<div class="flex gap-3 flex-wrap">
						{#if !showAssignees}
							<ShowAssigneesDialog onConfirm={handleShowAssignees} />
						{:else}
							<button
								type="button"
								on:click={() => (showAssignees = false)}
								class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
							>
								{$t('admin.hideAssignees')}
							</button>
						{/if}
						<button
							type="button"
							on:click={() => (showClearDialog = true)}
							class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
						>
							{$t('admin.clearData')}
						</button>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full border-collapse">
							<thead>
								<tr class="bg-gray-100">
									<th class="border border-gray-300 px-4 py-2 text-left">{$t('admin.name')}</th>
									<th class="border border-gray-300 px-4 py-2 text-left">{$t('admin.contact')}</th>
									<th class="border border-gray-300 px-4 py-2 text-left">{$t('admin.assignmentUrl')}</th>
									<th class="border border-gray-300 px-4 py-2 text-left">{$t('admin.giftReady')}</th>
									{#if showAssignees}
										<th class="border border-gray-300 px-4 py-2 text-left">
											{$t('admin.assignedTo')}
										</th>
									{/if}
								</tr>
							</thead>
							<tbody>
								{#each participants as participant, i}
									<tr class="hover:bg-gray-50">
										<td class="border border-gray-300 px-4 py-2 font-medium">
											{participant.name}
										</td>
										<td class="border border-gray-300 px-4 py-2 text-sm">
											{getContactInfo(participant)}
										</td>
										<td class="border border-gray-300 px-4 py-2">
											<div class="flex items-center gap-2">
												<a
													href={getAssignmentUrl(participant.token)}
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-600 hover:text-blue-800 underline text-xs truncate max-w-xs"
													title={getAssignmentUrl(participant.token)}
												>
													{getAssignmentUrl(participant.token)}
												</a>
												<button
													type="button"
													on:click={() => copyToClipboard(getAssignmentUrl(participant.token), i)}
													class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors whitespace-nowrap"
													title="Copy URL"
												>
													{copiedIndex === i ? $t('common.copied') : $t('common.copy')}
												</button>
											</div>
										</td>
										<td class="border border-gray-300 px-4 py-2">
											<input
												type="checkbox"
												checked={participant.gift_ready}
												on:change={(e) =>
													handleGiftStatusChange(participant.id, e.currentTarget.checked)}
												class="w-5 h-5"
											/>
										</td>
										{#if showAssignees}
											<td class="border border-gray-300 px-4 py-2">
												{getAssignedToName(participant) || '-'}
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if showClearDialog}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		role="button"
		tabindex="-1"
		on:click={() => (showClearDialog = false)}
		on:keydown={(e) => e.key === 'Escape' && (showClearDialog = false)}
	>
		<div
			class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="clear-dialog-title"
		>
			<h3 id="clear-dialog-title" class="text-xl font-bold text-gray-900 mb-4">⚠️ {$t('admin.clearDataWarning')}</h3>
			<div class="flex gap-3 justify-end">
				<button
					type="button"
					class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
					on:click={() => (showClearDialog = false)}
				>
					{$t('admin.no')}
				</button>
				<button
					type="button"
					class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
					on:click={handleClearData}
					disabled={loading}
				>
					{$t('admin.yes')}
				</button>
			</div>
		</div>
	</div>
{/if}

