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
	<button class="bg-blue-500 px-4 py-2 rounded text-white" on:click={handleCapture}>
		Capture Photo
	</button>

	{#if !isRecording}
		<button class="bg-green-500 px-4 py-2 rounded text-white" on:click={handleStartRecording}>
			Start Recording
		</button>
	{:else}
		<button class="bg-red-500 px-4 py-2 rounded text-white" on:click={handleStopRecording}>
			Stop Recording
		</button>
	{/if}
</div>
