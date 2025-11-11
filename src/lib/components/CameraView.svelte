<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';
	import TopBar from './TopBar.svelte';
	import BottomBar from './BottomBar.svelte';
	import SettingsPanel from './SettingsPanel.svelte';
	import CameraPreview from './CameraPreview.svelte';
	import { colorPalettes as predefinedPalettes, nearestColor } from '$lib/utils/colorUtils';
	import { settings } from '$lib/utils/settingsStore';
	import { get } from 'svelte/store';

	let currentSettings = {
		scale: 1,
		pixelSize: 10,
		selectedPalette: 'none',
		exposure: 1
	};

	// Subscribe to store updates
	settings.subscribe((s) => {
		currentSettings = s;
	});

	let stream: MediaStream | null = null;
	let isActive = false;
	let isMobile = false;
	let showSettings = false;
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: BlobPart[] = [];
	let isRecording = false;

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null;
	let displayCanvasElement: HTMLCanvasElement | null;
	let animationFrameId: number | undefined;

	// Subscribe settings store
	let scale: number;
	let pixelSize: number;
	let selectedPalette: string;
	let customPalettes: Record<string, [number, number, number][]>;
	let colorPalettes: Record<string, [number, number, number][]>;

	settings.subscribe((s) => {
		scale = s.scale;
		pixelSize = s.pixelSize;
		selectedPalette = s.selectedPalette;
		customPalettes = s.customPalettes;
		colorPalettes = { ...predefinedPalettes, ...customPalettes };
	});

	onMount(() => {
		if (browser) {
			checkMobile();
			window.addEventListener('resize', checkMobile);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', checkMobile);
			stopCamera();
		}
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	async function startCamera() {
		isActive = true;

		await tick(); // wait for <video> element to exist

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
			});

			if (videoElement) {
				stream = mediaStream;
				videoElement.srcObject = mediaStream;

				videoElement.onloadedmetadata = () => {
					videoElement.play();
					startProcessing();
				};
			}
		} catch (err) {
			console.error('Error accessing camera:', err);
			alert('Could not access camera. Please grant permissions.');
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
			isActive = false;
		}
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
	}

	function startProcessing() {
		const processFrame = () => {
			if (!videoElement || !canvasElement || !displayCanvasElement) return;
			if (!videoElement.videoWidth || !videoElement.videoHeight) {
				animationFrameId = requestAnimationFrame(processFrame);
				return;
			}

			const video = videoElement;
			const canvas = canvasElement;
			const displayCanvas = displayCanvasElement;
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			const displayCtx = displayCanvas.getContext('2d');

			if (ctx && displayCtx) {
				// 1. Small processing canvas for pixelation
				const smallW = Math.max(1, Math.floor(video.videoWidth / pixelSize));
				const smallH = Math.max(1, Math.floor(video.videoHeight / pixelSize));
				canvas.width = smallW;
				canvas.height = smallH;

				ctx.drawImage(video, 0, 0, smallW, smallH);

				// 2. Apply selected palette
				if (selectedPalette !== 'none' && ctx) {
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const data = imageData.data;

					for (let i = 0; i < data.length; i += 4) {
						let r = data[i] * currentSettings.exposure;
						let g = data[i + 1] * currentSettings.exposure;
						let b = data[i + 2] * currentSettings.exposure;

						const [nr, ng, nb] = nearestColor(
							Math.min(255, r),
							Math.min(255, g),
							Math.min(255, b),
							colorPalettes[currentSettings.selectedPalette] || []
						);

						data[i] = nr;
						data[i + 1] = ng;
						data[i + 2] = nb;
					}

					ctx.putImageData(imageData, 0, 0);
				}

				// 3. Upscale to display canvas
				displayCanvas.width = Math.floor(video.videoWidth * scale);
				displayCanvas.height = Math.floor(video.videoHeight * scale);
				displayCtx.imageSmoothingEnabled = false;
				displayCtx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
			}

			animationFrameId = requestAnimationFrame(processFrame);
		};

		processFrame();
	}

	function capturePhoto() {
		if (displayCanvasElement) {
			displayCanvasElement.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `camera-${Date.now()}.png`;
					a.click();
					URL.revokeObjectURL(url);
				}
			});
		}
	}

	function toggleSettings() {
		showSettings = !showSettings;
	}

	// Video recording utilities
	function startRecording() {
		if (!displayCanvasElement) return;

		const stream = displayCanvasElement.captureStream(30); // 30fps
		recordedChunks = [];
		mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) recordedChunks.push(e.data);
		};

		mediaRecorder.onstop = () => {
			const blob = new Blob(recordedChunks, { type: 'video/webm' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `camera-video-${Date.now()}.webm`;
			a.click();
			URL.revokeObjectURL(url);
		};

		mediaRecorder.start();
		isRecording = true;
	}

	function stopRecording() {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}
</script>

<div
	class={isMobile
		? 'fixed inset-0 bg-black'
		: 'flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8'}
>
	<div
		class={isMobile
			? 'flex h-full w-full flex-col'
			: 'flex aspect-video w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-black shadow-2xl'}
	>
		<TopBar {isMobile} {isActive} on:toggleSettings={toggleSettings} on:stop={stopCamera} />

		<CameraPreview
			{isMobile}
			{isActive}
			bind:videoElement
			bind:canvasElement
			bind:displayCanvasElement
			on:start={startCamera}
		/>

		{#if showSettings && isActive}
			<SettingsPanel {isMobile} on:close={() => (showSettings = false)} />
		{/if}

		{#if isActive}
			<BottomBar
				{isMobile}
				on:capture={capturePhoto}
				on:startRecording={startRecording}
				on:stopRecording={stopRecording}
				{isRecording}
			/>
		{/if}
	</div>
</div>
