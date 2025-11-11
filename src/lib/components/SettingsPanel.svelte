<script lang="ts">
	import { settings } from '$lib/utils/settingsStore';
	import { colorPalettes } from '$lib/utils/colorUtils';
	import { onMount } from 'svelte';

	export let isMobile: boolean;
	export let onClose: () => void;

	let palettes = colorPalettes;

	// Declare localSettings here to fix "not defined" error
	let localSettings = {
		scale: 1,
		pixelSize: 10,
		selectedPalette: 'none',
		exposure: 1
	};

	let isOpen = false;

	// Subscribe to settings store
	const unsubscribe = settings.subscribe((s) => {
		localSettings = { ...s }; // Make a copy
	});

	onMount(() => {
		isOpen = true; // trigger slide-up animation
		return () => unsubscribe();
	});

	// Update store whenever sliders change
	function updateSettings() {
		settings.set({ ...localSettings });
	}

	function closePanel() {
		isOpen = false;
		setTimeout(() => {
			if (onClose) onClose();
		}, 200);
	}
</script>

<!-- Shadow/blur behind panel -->
<div
	class="pointer-events-none absolute bottom-0 left-0 z-30 h-24 w-full"
	style="background: linear-gradient(transparent, rgba(0,0,0,0.5));"
></div>

<!-- Panel -->
<div
	class="absolute bottom-0 left-0 z-40 w-full max-w-full space-y-4 rounded-t-3xl bg-gray-900/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-200"
	class:translate-y-0={isOpen}
	class:translate-y-full={!isOpen}
	on:click|stopPropagation
>
	<h2 class="text-center text-lg font-semibold text-white">Settings</h2>

	<!-- Palette -->
	<div class="space-y-1">
		<label class="block text-sm font-medium text-white">Color Palette</label>
		<select
			bind:value={localSettings.selectedPalette}
			on:change={updateSettings}
			class="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>
			<option value="none">None</option>
			{#each Object.keys(palettes) as palette}
				<option value={palette}>{palette}</option>
			{/each}
		</select>
	</div>

	<!-- Pixelation -->
	<div class="space-y-1">
		<label class="block text-sm font-medium text-white">
			Pixel Size: {Math.round(localSettings.pixelSize)}
		</label>
		<input
			type="range"
			min="2"
			max="50"
			step="1"
			bind:value={localSettings.pixelSize}
			on:input={updateSettings}
			class="w-full accent-blue-500"
		/>
	</div>

	<!-- Display scale -->
	<div class="space-y-1">
		<label class="block text-sm font-medium text-white">
			Display Scale: {Math.round(localSettings.scale * 100)}%
		</label>
		<input
			type="range"
			min="0.1"
			max="1"
			step="0.05"
			bind:value={localSettings.scale}
			on:input={updateSettings}
			class="w-full accent-blue-500"
		/>
	</div>

	<!-- Exposure -->
	<div class="space-y-1">
		<label class="block text-sm font-medium text-white">
			Exposure: {localSettings.exposure.toFixed(2)}
		</label>
		<input
			type="range"
			min="0.1"
			max="3"
			step="0.05"
			bind:value={localSettings.exposure}
			on:input={updateSettings}
			class="w-full accent-yellow-500"
		/>
	</div>

	<!-- Close Button -->
	<div class="mt-2 flex justify-center">
		<button
			on:click={closePanel}
			class="rounded-full bg-blue-500 px-5 py-2 font-medium transition hover:bg-blue-600"
		>
			Close
		</button>
	</div>
</div>
