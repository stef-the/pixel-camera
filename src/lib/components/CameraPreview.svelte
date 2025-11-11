<!-- src/lib/components/CameraPreview.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	export let isMobile;
	export let isActive;
	export let scale;
	export let videoElement;
	export let canvasElement;
	export let displayCanvasElement;

	const dispatch = createEventDispatcher();
</script>

<div class="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
	{#if !isActive}
		<button 
			class="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/10 hover:bg-white/20 transition-all active:scale-95"
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
			<span class="text-white text-lg">Start Camera</span>
		</button>
	{:else}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted
			class="hidden"
		></video>
		<canvas bind:this={canvasElement} class="hidden"></canvas>
		<canvas
			bind:this={displayCanvasElement}
			class="max-w-full max-h-full object-contain"
			style="image-rendering: {scale < 1 ? 'pixelated' : 'auto'};"
		></canvas>
	{/if}
</div>