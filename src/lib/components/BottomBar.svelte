<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { settings } from '$lib/utils/settingsStore';
	import { colorPalettes } from '$lib/utils/colorUtils';
	import { onMount } from 'svelte';

	export let isMobile: boolean;
	export let isRecording: boolean;
	export let availableCameras: MediaDeviceInfo[] = [];
	export let selectedCameraId: string = '';

	const dispatch = createEventDispatcher();
	let showSettings = false;

	let palettes = colorPalettes;
	let localSettings = {
		scale: 1,
		pixelSize: 10,
		selectedPalette: 'none',
		exposure: 1
	};

	const unsubscribe = settings.subscribe((s) => {
		localSettings = { ...s };
	});

	onMount(() => {
		return () => unsubscribe();
	});

	function updateSettings() {
		settings.set({ ...localSettings });
	}

	function toggleSettings() {
		showSettings = !showSettings;
		dispatch('toggleSettings');
	}

	function handleCapture() {
		dispatch('capture');
	}

	function handleStartRecording() {
		dispatch('startRecording');
	}

	function handleStopRecording() {
		dispatch('stopRecording');
	}

	function handleCameraChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		dispatch('cameraChange', { deviceId: target.value });
	}
</script>

<!-- Fixed positioning container -->
<div class="pointer-events-none fixed right-0 bottom-0 left-0 z-50">
	<div class="pointer-events-auto relative w-full">
		<!-- Settings Panel -->
		{#if showSettings}
			<div
				class="absolute right-0 bottom-full left-0 mb-0 w-full rounded-t-2xl border-x border-t border-gray-700 bg-gray-900/95 p-4 shadow-xl backdrop-blur-lg"
				style="transform: translateZ(0); -webkit-transform: translateZ(0);"
				role="region"
				aria-label="Settings panel"
			>
				<!-- Inner wrapper just to stop click propagation -->
				<div role="presentation" on:click|stopPropagation>
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-lg font-semibold text-white">Settings</h2>
						<button
							on:click={toggleSettings}
							class="text-white transition hover:text-gray-300"
							aria-label="Close settings"
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
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>

					<!-- Settings Grid -->
					<div class="grid grid-cols-2 gap-3 text-sm text-white">
						<!-- Camera Selection -->
						{#if availableCameras.length > 1}
							<label for="camera-select" class="col-span-2 font-medium">Camera</label>
							<select
								id="camera-select"
								value={selectedCameraId}
								on:change={handleCameraChange}
								class="col-span-2 rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white focus:ring-2 focus:ring-blue-500"
							>
								{#each availableCameras as camera}
									<option value={camera.deviceId}>
										{camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
									</option>
								{/each}
							</select>
						{/if}

						<label for="palette-select">Palette</label>
						<select
							id="palette-select"
							bind:value={localSettings.selectedPalette}
							on:change={updateSettings}
							class="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white focus:ring-2 focus:ring-blue-500"
						>
							<option value="none">None</option>
							{#each Object.keys(palettes) as palette}
								<option value={palette}>{palette}</option>
							{/each}
						</select>

						<label for="pixel-size-slider">Pixel Size: {Math.round(localSettings.pixelSize)}</label>
						<input
							id="pixel-size-slider"
							type="range"
							min="2"
							max="50"
							step="1"
							bind:value={localSettings.pixelSize}
							on:input={updateSettings}
							class="w-full accent-blue-500"
						/>

						<label for="scale-slider">Scale: {Math.round(localSettings.scale * 100)}%</label>
						<input
							id="scale-slider"
							type="range"
							min="0.1"
							max="1"
							step="0.05"
							bind:value={localSettings.scale}
							on:input={updateSettings}
							class="w-full accent-blue-500"
						/>

						<label for="exposure-slider">Exposure: {localSettings.exposure.toFixed(2)}</label>
						<input
							id="exposure-slider"
							type="range"
							min="0.1"
							max="3"
							step="0.05"
							bind:value={localSettings.exposure}
							on:input={updateSettings}
							class="w-full accent-yellow-500"
						/>
					</div>
				</div>
			</div>
		{/if}

		<!-- Bottom Bar -->
		<div
			class="flex justify-center space-x-4 border-t border-gray-800 bg-black/80 p-4 backdrop-blur-md"
		>
			<!-- Toggle Settings Button -->
			<button
				class="rounded bg-white/10 p-2 transition-colors hover:bg-white/20"
				on:click={toggleSettings}
				aria-label="Toggle settings"
			>
				{#if !showSettings}
					<!-- Gear Icon -->
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
						<circle cx="12" cy="12" r="3" />
						<path
							d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 
							0 1 1-2.83 2.83l-.06-.06a1.65 
							1.65 0 0 0-1.82-.33 1.65 
							1.65 0 0 0-1 1.51V21a2 2 0 1 
							1-4 0v-.09a1.65 1.65 0 0 
							0-1-1.51 1.65 1.65 0 0 
							0-1.82.33l-.06.06a2 2 0 1 
							1-2.83-2.83l.06-.06a1.65 
							1.65 0 0 0 .33-1.82 1.65 
							1.65 0 0 0-1.51-1H3a2 2 0 1 
							1 0-4h.09a1.65 1.65 0 0 
							0 1.51-1 1.65 1.65 0 0 
							0-.33-1.82l-.06-.06a2 
							2 0 1 1 2.83-2.83l.06.06a1.65 
							1.65 0 0 0 1.82.33H9a1.65 
							1.65 0 0 0 1-1.51V3a2 2 0 1 
							1 4 0v.09a1.65 1.65 0 0 
							0 1 1.51 1.65 1.65 0 0 
							0 1.82-.33l.06-.06a2 2 0 1 
							1 2.83 2.83l-.06.06a1.65 
							1.65 0 0 0-.33 1.82V9c0 
							.69.4 1.3 1.01 1.63.29.16.63.26.99.27H21a2 2 0 1 1 0 4h-.09a1.65 
							1.65 0 0 0-1.51 1z"
						/>
					</svg>
				{:else}
					<!-- X Icon -->
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
				{/if}
			</button>

			<!-- Capture and Record Buttons -->
			<button class="rounded bg-blue-500 px-4 py-2 text-white" on:click={handleCapture}>
				Capture Photo
			</button>

			{#if !isRecording}
				<button class="rounded bg-green-500 px-4 py-2 text-white" on:click={handleStartRecording}>
					Start Recording
				</button>
			{:else}
				<button class="rounded bg-red-500 px-4 py-2 text-white" on:click={handleStopRecording}>
					Stop Recording
				</button>
			{/if}
		</div>
	</div>
</div>
