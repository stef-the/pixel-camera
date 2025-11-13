<!-- src/lib/components/CameraPreview.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	//export let isMobile;
	export let isActive;
	export let videoElement;
	export let canvasElement;
	export let displayCanvasElement;

	const dispatch = createEventDispatcher();
</script>

<div class="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
	{#if !isActive}
		<button
			class="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-8 transition-all hover:bg-white/20 active:scale-95"
			on:click={() => dispatch('start')}
			aria-label="Start camera"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="64"
				height="64"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-white"
			>
				<path
					d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
				/>
				<circle cx="12" cy="13" r="3" />
			</svg>
			<span class="text-lg text-white">Start Camera</span>
		</button>
	{:else}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted
			class="absolute h-full w-full object-cover opacity-0"
		></video>
		<div class="absolute bottom-2 left-2 text-xs text-white">
			{videoElement?.videoWidth}×{videoElement?.videoHeight}
		</div>

		<canvas bind:this={canvasElement} class="hidden"></canvas>
		<canvas
			bind:this={displayCanvasElement}
			class="max-h-full max-w-full object-contain"
			style="image-rendering: pixelated;"
		></canvas>
	{/if}
</div>
