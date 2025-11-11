<!-- src/lib/components/BottomBar.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let isMobile: boolean;

	const dispatch = createEventDispatcher();
</script>

<div class="p-6 flex justify-center items-center z-10 {isMobile ? 'backdrop-blur-xl bg-black/40' : 'bg-gradient-to-t from-black/60 to-transparent'}">
	<button 
		class="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center active:scale-95"
		on:click={() => dispatch('capture')}
		aria-label="Capture photo"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-gray-800"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
	</button>
</div>