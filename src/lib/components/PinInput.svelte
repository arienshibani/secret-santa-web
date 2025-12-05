<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let length: number = 6;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	let inputs: HTMLInputElement[] = [];
	let pinArray: string[] = Array(length).fill('');
	let focusedIndex: number | null = null;
	let showPin = false; // Toggle for showing/hiding PIN

	const updateValue = () => {
		const newValue = pinArray.join('');
		if (newValue !== value) {
			value = newValue;
			dispatch('input', { value: newValue });
		}
	};

	// Find the last filled index
	const getLastFilledIndex = (): number => {
		for (let i = pinArray.length - 1; i >= 0; i--) {
			if (pinArray[i]) return i;
		}
		return -1;
	};

	const updateInputDisplay = (index: number) => {
		const input = inputs[index];
		if (!input) return;

		if (showPin) {
			// Show actual value when reveal is active
			input.value = pinArray[index] || '';
			input.classList.remove('pin-masked');
		} else {
			const lastFilledIndex = getLastFilledIndex();
			const isFocused = index === focusedIndex;
			const isLastFilled = index === lastFilledIndex;
			const hasValue = !!pinArray[index];

			if (!hasValue) {
				input.value = '';
				input.classList.remove('pin-masked');
			} else if (isFocused || isLastFilled) {
				// Show actual digit if focused or it's the last filled one
				input.value = pinArray[index];
				input.classList.remove('pin-masked');
			} else {
				// Mask all other filled digits
				input.value = '●';
				input.classList.add('pin-masked');
			}
		}
	};

	const updateAllDisplays = () => {
		for (let i = 0; i < length; i++) {
			updateInputDisplay(i);
		}
	};

	const handleInput = (index: number, event: Event) => {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value.replace(/\D/g, ''); // Only numbers

		if (inputValue.length > 1) {
			// If pasting multiple digits
			const digits = inputValue.slice(0, length - index).split('');
			digits.forEach((digit, i) => {
				if (index + i < length) {
					pinArray[index + i] = digit;
				}
			});
			updateAllDisplays();
			// Focus the next empty input or the last one
			const nextIndex = Math.min(index + digits.length, length - 1);
			if (inputs[nextIndex]) {
				inputs[nextIndex].focus();
			}
		} else {
			pinArray[index] = inputValue;
			
			// Move to next input if value entered
			if (inputValue && index < length - 1) {
				// Update displays before moving focus
				updateAllDisplays();
				setTimeout(() => {
					inputs[index + 1]?.focus();
				}, 10);
			} else {
				updateAllDisplays();
			}
		}

		updateValue();
	};

	const handleKeyDown = (index: number, event: KeyboardEvent) => {
		if (event.key === 'Backspace') {
			if (!pinArray[index] && index > 0) {
				// Clear previous input
				pinArray[index - 1] = '';
				inputs[index - 1]?.focus();
			} else if (pinArray[index]) {
				// Clear current input
				pinArray[index] = '';
			}
			updateAllDisplays();
			updateValue();
		}
	};

	const handleFocus = (index: number) => {
		focusedIndex = index;
		updateInputDisplay(index);
	};

	const handleBlur = (index: number) => {
		focusedIndex = null;
		// Small delay to ensure the last filled index is updated
		setTimeout(() => {
			updateAllDisplays();
		}, 10);
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '') || '';
		const digits = pastedData.slice(0, length).split('');

		digits.forEach((digit, i) => {
			if (i < length) {
				pinArray[i] = digit;
			}
		});

		updateAllDisplays();
		updateValue();
		const nextEmptyIndex = Math.min(digits.length, length - 1);
		inputs[nextEmptyIndex]?.focus();
	};

	const toggleShowPin = () => {
		showPin = !showPin;
		updateAllDisplays();
	};

	$: {
		if (value && value.length === length) {
			// Sync external value changes
			const digits = value.split('');
			digits.forEach((digit, i) => {
				if (i < length) {
					pinArray[i] = digit;
				}
			});
			updateAllDisplays();
		} else if (!value) {
			pinArray = Array(length).fill('');
			inputs.forEach((input) => {
				if (input) {
					input.value = '';
					input.classList.remove('pin-masked');
				}
			});
		}
	}

	$: if (showPin !== undefined) {
		updateAllDisplays();
	}
</script>

<div class="flex flex-col items-center gap-2">
	<div class="flex gap-2 justify-center items-center" on:paste={handlePaste}>
		{#each Array(length) as _, i}
			<input
				type="text"
				inputmode="numeric"
				pattern="[0-9]*"
				maxlength="1"
				bind:this={inputs[i]}
				value=""
				disabled={disabled}
				on:input={(e) => handleInput(i, e)}
				on:keydown={(e) => handleKeyDown(i, e)}
				on:focus={() => handleFocus(i)}
				on:blur={() => handleBlur(i)}
				class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed pin-input"
				style="font-family: monospace;"
			/>
		{/each}
		<button
			type="button"
			on:click={toggleShowPin}
			class="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
			aria-label={showPin ? "Hide PIN" : "Show PIN"}
			title={showPin ? "Hide PIN" : "Show PIN"}
		>
			{#if showPin}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L9.88 9.88m-3.29-3.29l3.29 3.29m13.29 13.29l-3.29-3.29m0 0L14.12 14.12m3.29-3.29l-3.29 3.29m0 0L12 12"
					/>
				</svg>
			{:else}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</div>

<style>
	:global(.pin-input.pin-masked) {
		-webkit-text-security: disc;
		text-security: disc;
	}
</style>
