<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isMobile: boolean;
	export let isRecording: boolean;

	const dispatch = createEventDispatcher();

	function handleCapture() {
		dispatch('capture');
	}

	function handleStartRecording() {
		dispatch('startRecording');
	}

	function handleStopRecording() {
		dispatch('stopRecording');
	}
</script>

<div class="flex justify-center space-x-4 p-4">
	<button
		class="rounded bg-white/10 p-2 transition-colors hover:bg-white/20"
		on:click={() => dispatch('toggleSettings')}
		aria-label="Toggle settings"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-white"
		>
			<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
		</svg>
	</button>
	<button class="rounded bg-blue-500 px-4 py-2 text-white" on:click={handleCapture}>
		Capture Photo
	</button>

	{#if !isRecording}
		<button class="rounded bg-green-500 px-4 py-2 text-white" on:click={handleStartRecording}>
			Start Recording
		</button>
	{:else}
		<button class="rounded bg-red-500 px-4 py-2 text-white" on:click={handleStopRecording}>
			Stop Recording
		</button>
	{/if}
</div>
