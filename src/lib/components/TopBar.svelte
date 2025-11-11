<!-- src/lib/components/TopBar.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isMobile: boolean;
	export let isActive: boolean;

	const dispatch = createEventDispatcher();
</script>

<div
	class="z-10 flex items-center justify-between p-4 {isMobile
		? 'bg-black/40 backdrop-blur-xl'
		: 'bg-gradient-to-b from-black/60 to-transparent'}"
>
	<button
		class="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
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

	<div class="font-semibold text-white">Camera</div>

	{#if isActive}
		<button
			class="rounded-full bg-red-500/80 p-2 transition-colors hover:bg-red-600"
			on:click={() => dispatch('stop')}
			aria-label="Stop camera"
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
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	{:else}
		<div class="w-10"></div>
	{/if}
</div>
