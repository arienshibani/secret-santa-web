<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let length: number = 6;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	let inputs: HTMLInputElement[] = [];
	let pinArray: string[] = Array(length).fill('');

	const updateValue = () => {
		const newValue = pinArray.join('');
		if (newValue !== value) {
			value = newValue;
			dispatch('input', { value: newValue });
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
					if (inputs[index + i]) {
						inputs[index + i].value = digit;
					}
				}
			});
			// Focus the next empty input or the last one
			const nextIndex = Math.min(index + digits.length, length - 1);
			if (inputs[nextIndex]) {
				inputs[nextIndex].focus();
			}
		} else {
			pinArray[index] = inputValue;
			target.value = inputValue;

			// Move to next input if value entered
			if (inputValue && index < length - 1) {
				inputs[index + 1]?.focus();
			}
		}

		updateValue();
	};

	const handleKeyDown = (index: number, event: KeyboardEvent) => {
		if (event.key === 'Backspace' && !pinArray[index] && index > 0) {
			inputs[index - 1]?.focus();
		}
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '') || '';
		const digits = pastedData.slice(0, length).split('');

		digits.forEach((digit, i) => {
			if (i < length) {
				pinArray[i] = digit;
				if (inputs[i]) {
					inputs[i].value = digit;
				}
			}
		});

		value = pinArray.join('');
		const nextEmptyIndex = Math.min(digits.length, length - 1);
		inputs[nextEmptyIndex]?.focus();
	};

	$: {
		if (value && value.length === length) {
			// Sync external value changes
			const digits = value.split('');
			digits.forEach((digit, i) => {
				if (i < length) {
					pinArray[i] = digit;
					if (inputs[i]) {
						inputs[i].value = digit;
					}
				}
			});
		} else if (!value) {
			pinArray = Array(length).fill('');
			inputs.forEach((input) => {
				if (input) input.value = '';
			});
		}
	}
</script>

<div class="flex gap-2 justify-center" on:paste={handlePaste}>
	{#each Array(length) as _, i}
		<input
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="1"
			bind:this={inputs[i]}
			value={pinArray[i]}
			disabled={disabled}
			on:input={(e) => handleInput(i, e)}
			on:keydown={(e) => handleKeyDown(i, e)}
			class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
		/>
	{/each}
</div>

