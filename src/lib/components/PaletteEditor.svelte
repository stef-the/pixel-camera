<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { settings } from '$lib/utils/settingsStore';
    import { colorPalettes } from '$lib/utils/colorUtils';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

	let paletteName = '';
	let colors: string[] = ['#000000'];
	let editingPaletteName = '';
	let isEditMode = false;

	let localCustomPalettes: Record<string, [number, number, number][]> = {};

	const unsubscribe = settings.subscribe((s) => {
		localCustomPalettes = (s as any).customPalettes || {};
	});

	function addColor() {
		colors = [...colors, '#000000'];
	}

	function removeColor(index: number) {
		if (colors.length > 1) {
			colors = colors.filter((_, i) => i !== index);
		}
	}

	function updateColor(index: number, value: string) {
		colors[index] = value;
	}

	function hexToRgb(hex: string): [number, number, number] {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
			: [0, 0, 0];
	}

	function savePalette() {
		if (!paletteName.trim()) {
			alert('Please enter a palette name');
			return;
		}

		const rgbColors: [number, number, number][] = colors.map(hexToRgb);

		const updatedPalettes = {
			...localCustomPalettes,
			[paletteName]: rgbColors
		};

		settings.update((s) => ({
			...s,
			customPalettes: updatedPalettes
		}));

        // Add new custom palette to colorPalettes
        colorPalettes[paletteName] = rgbColors;
        console.log("Added new palette to colorPalettes:", paletteName, rgbColors);
        console.log("Current colorPalettes:", colorPalettes);

		// Reset form
		paletteName = '';
		colors = ['#000000'];
		isEditMode = false;
		editingPaletteName = '';
	}

	function editPalette(name: string) {
		const palette = localCustomPalettes[name];
		if (palette) {
			editingPaletteName = name;
			paletteName = name;
			colors = palette.map((rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`);
			isEditMode = true;
		}
	}

	function deletePalette(name: string) {
		if (confirm(`Delete palette "${name}"?`)) {
			const updatedPalettes = { ...localCustomPalettes };
			delete updatedPalettes[name];

			settings.update((s) => ({
				...s,
				customPalettes: updatedPalettes,
				selectedPalette: s.selectedPalette === name ? 'none' : s.selectedPalette
			}));
		}
	}

	function cancelEdit() {
		paletteName = '';
		colors = ['#000000'];
		isEditMode = false;
		editingPaletteName = '';
	}

	function close() {
		dispatch('close');
	}
</script>

{#if isOpen}
	<!-- Modal Overlay: purely visual, non-interactive -->
	<div class="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
		<!-- Modal Content -->
		<div
			class="flex h-full w-full flex-col bg-gray-900 md:h-[80vh] md:max-w-2xl md:rounded-2xl"
			role="presentation"
			on:click|stopPropagation
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-700 p-4">
				<h2 class="text-xl font-semibold text-white">
					{isEditMode ? 'Edit Palette' : 'Create Custom Palette'}
				</h2>
				<button
					on:click={close}
					class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
					aria-label="Close palette editor"
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
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-4">
				<!-- Palette Name Input -->
				<div class="mb-6">
					<label for="palette-name" class="mb-2 block text-sm font-medium text-white">
						Palette Name
					</label>
					<input
						id="palette-name"
						type="text"
						bind:value={paletteName}
						placeholder="e.g., My Palette"
						class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<!-- Colors Section -->
				<div class="mb-6">
					<div class="mb-2 flex items-center justify-between">
						<label for="add-color-button" class="block text-sm font-medium text-white">Colors</label>
						<button
                            id="add-color-button"
							on:click={addColor}
							class="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
						>
							+ Add Color
						</button>
					</div>

					<div class="space-y-3">
						{#each colors as color, index}
							<div class="flex items-center gap-3">
								<!-- Color Preview -->
								<div
									class="h-12 w-12 shrink-0 rounded-lg border-2 border-gray-700"
									style="background-color: {color};"
								></div>

								<!-- Hex Input -->
								<input
									type="text"
									value={color}
									on:input={(e) => updateColor(index, e.currentTarget.value)}
									placeholder="#000000"
									class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-mono text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>

								<!-- Remove Button -->
								<button
									on:click={() => removeColor(index)}
									disabled={colors.length === 1}
									class="shrink-0 rounded-lg p-2 text-red-400 transition-colors hover:bg-red-900/30 disabled:opacity-30 disabled:hover:bg-transparent"
									aria-label="Remove color"
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
									>
										<polyline points="3 6 5 6 21 6" />
										<path
											d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
										/>
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Existing Palettes -->
				{#if Object.keys(localCustomPalettes).length > 0}
					<div class="border-t border-gray-700 pt-6">
						<h3 class="mb-3 text-sm font-medium text-white">Your Custom Palettes</h3>
						<div class="space-y-2">
							{#each Object.entries(localCustomPalettes) as [name, palette]}
								<div
									class="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3"
								>
									<div class="flex items-center gap-3">
										<div class="flex gap-1">
											{#each palette.slice(0, 5) as color}
												<div
													class="h-6 w-6 rounded border border-gray-600"
													style="background-color: rgb({color[0]}, {color[1]}, {color[2]});"
												></div>
											{/each}
											{#if palette.length > 5}
												<div
													class="flex h-6 w-6 items-center justify-center rounded border border-gray-600 bg-gray-700 text-xs text-gray-400"
												>
													+{palette.length - 5}
												</div>
											{/if}
										</div>
										<span class="text-white">{name}</span>
									</div>
									<div class="flex gap-2">
										<button
											on:click={() => editPalette(name)}
											class="rounded px-3 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-900/30"
										>
											Edit
										</button>
										<button
											on:click={() => deletePalette(name)}
											class="rounded px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-900/30"
										>
											Delete
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="border-t border-gray-700 p-4">
				<div class="flex gap-3">
					{#if isEditMode}
						<button
							on:click={cancelEdit}
							class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
						>
							Cancel Edit
						</button>
					{/if}
					<button
						on:click={savePalette}
						class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						{isEditMode ? 'Update Palette' : 'Save Palette'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
