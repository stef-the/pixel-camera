<script lang="ts">
	import { settings } from '$lib/utils/settingsStore';
	import { colorPalettes } from '$lib/utils/colorUtils';
	import { get } from 'svelte/store';

	export let isMobile: boolean;
	export let onClose: () => void;

	// Two-way bind to the settings store
	let scale: number;
	let pixelSize: number;
	let selectedPalette: string;
	let palettes = colorPalettes;

	settings.subscribe((s) => {
		scale = s.scale;
		pixelSize = s.pixelSize;
		selectedPalette = s.selectedPalette;
	});

	$: settings.update((s) => ({ ...s, scale, pixelSize, selectedPalette }));
</script>

<!-- Subtle “dim behind panel” only for the panel area -->
<div
	class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-[90%] max-w-md rounded-3xl bg-gray-900/70 backdrop-blur-md shadow-2xl p-5 space-y-4"
	on:click|stopPropagation
>
	<h2 class="text-lg font-semibold text-white text-center">Settings</h2>

	<!-- Palette Dropdown -->
	<div class="space-y-1">
		<label for="palette-select" class="block text-sm font-medium text-white">
			Color Palette
		</label>
		<select
			id="palette-select"
			bind:value={selectedPalette}
			class="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="none">None</option>
			{#each Object.keys(palettes) as palette}
				<option value={palette}>{palette}</option>
			{/each}
		</select>
	</div>

	<!-- Pixelation Slider -->
	<div class="space-y-1">
		<label for="pixel-size-slider" class="block text-sm font-medium text-white">
			Pixel Size: {Math.round(pixelSize)}
		</label>
		<input
			id="pixel-size-slider"
			type="range"
			min="2"
			max="50"
			step="1"
			bind:value={pixelSize}
			class="w-full accent-blue-500"
		/>
	</div>

	<!-- Display Scale Slider -->
	<div class="space-y-1">
		<label for="scale-slider" class="block text-sm font-medium text-white">
			Display Scale: {Math.round(scale * 100)}%
		</label>
		<input
			id="scale-slider"
			type="range"
			min="0.1"
			max="1"
			step="0.05"
			bind:value={scale}
			class="w-full accent-blue-500"
		/>
	</div>

	<!-- Close button -->
	<div class="flex justify-center mt-2">
		<button
			on:click={onClose}
			class="bg-blue-500 px-5 py-2 rounded-full font-medium hover:bg-blue-600 transition"
		>
			Close
		</button>
	</div>
</div>
