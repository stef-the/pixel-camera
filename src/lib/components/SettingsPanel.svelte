<script lang="ts">
	import { settings } from '$lib/utils/settingsStore';
	import { colorPalettes as predefinedPalettes } from '$lib/utils/colorUtils';
	import { get } from 'svelte/store';

	let scale: number;
	let pixelSize: number;
	let selectedPalette: string;

	// Subscribe store to local variables
	settings.subscribe((s) => {
		scale = s.scale;
		pixelSize = s.pixelSize;
		selectedPalette = s.selectedPalette;
	});

	// Update store when values change
	$: settings.update((s) => ({ ...s, scale }));
	$: settings.update((s) => ({ ...s, pixelSize }));
	$: settings.update((s) => ({ ...s, selectedPalette }));

	// Combine predefined + custom palettes
	$: colorPalettes = { ...predefinedPalettes, ...get(settings).customPalettes };
</script>

<div class="absolute z-20 ...">
	<!-- Palette Dropdown -->
	<div class="space-y-2">
		<label for="palette-select" class="block text-sm font-medium text-white">
			Color Palette
		</label>
		<select
			id="palette-select"
			bind:value={selectedPalette}
			class="w-full rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-white"
		>
			<option value="none">None</option>
			{#each Object.keys(colorPalettes) as palette}
				<option value={palette}>{palette}</option>
			{/each}
		</select>
	</div>

	<!-- Pixelation Slider -->
	<div class="space-y-2">
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
	<div class="space-y-2">
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
</div>
