<!-- src/lib/components/SettingsPanel.svelte -->
<script lang="ts">
	export let isMobile: boolean;
	export let selectedPalette: string;
	export let scale: number;
</script>

<div class="absolute z-20 bg-black/80 backdrop-blur-xl rounded-2xl p-4 space-y-4 {isMobile ? 'bottom-24 left-4 right-4' : 'top-20 left-4 min-w-[250px]'}">
	<div class="space-y-2">
		<label for="palette-select" class="text-white text-sm font-medium block">
			Color Palette
		</label>
		<select 
			id="palette-select" 
			bind:value={selectedPalette} 
			class="w-full bg-white/10 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="none">None</option>
			<option value="grayscale">Grayscale</option>
			<option value="retro">Retro</option>
			<option value="gameboy">Game Boy</option>
			<option value="cyberpunk">Cyberpunk</option>
			<option value="pastel">Pastel</option>
		</select>
	</div>

	<div class="space-y-2">
		<label for="scale-slider" class="text-white text-sm font-medium block">
			Scale: {Math.round(scale * 100)}%
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

<style>
	select option {
		background-color: rgb(31, 41, 55);
		color: white;
	}
</style>