<!-- src/lib/components/CameraView.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import TopBar from './TopBar.svelte';
	import BottomBar from './BottomBar.svelte';
	import SettingsPanel from './SettingsPanel.svelte';
	import CameraPreview from './CameraPreview.svelte';
	import { colorPalettes, nearestColor } from '$lib/utils/colorUtils';

	let stream: MediaStream | null = null;
	let isActive = false;
	let selectedPalette: keyof typeof colorPalettes | 'none' = 'none';
	let scale = 1;
	let isMobile = false;
	let showSettings = false;

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null;
	let displayCanvasElement: HTMLCanvasElement | null;
	let animationFrameId: number | undefined;

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
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment',
					width: { ideal: 1920 },
					height: { ideal: 1080 }
				}
			});
			stream = mediaStream;
			isActive = true;

			if (videoElement) {
				videoElement.srcObject = mediaStream;
				startProcessing();
			}
		} catch (err) {
			console.error('Error accessing camera:', err);
			alert('Could not access camera. Please ensure camera permissions are granted.');
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
			isActive = false;
		}
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	}

	function startProcessing() {
		const processFrame = () => {
			if (!videoElement || !canvasElement || !displayCanvasElement) return;

			const video = videoElement;
			const canvas = canvasElement;
			const displayCanvas = displayCanvasElement;
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			const displayCtx = displayCanvas.getContext('2d');

			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				const scaledWidth = Math.floor(canvas.width * scale);
				const scaledHeight = Math.floor(canvas.height * scale);

				displayCanvas.width = scaledWidth;
				displayCanvas.height = scaledHeight;

				if (ctx) {
					ctx.drawImage(video, 0, 0);
				}

				if (selectedPalette !== 'none' && ctx) {
					const palette = colorPalettes[selectedPalette];
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const data = imageData.data;

					for (let i = 0; i < data.length; i += 4) {
						const [nr, ng, nb] = nearestColor(data[i], data[i + 1], data[i + 2], palette);
						data[i] = nr;
						data[i + 1] = ng;
						data[i + 2] = nb;
					}

					ctx.putImageData(imageData, 0, 0);
				}

				if (displayCtx) {
					displayCtx.imageSmoothingEnabled = false;
					displayCtx.drawImage(
						canvas,
						0,
						0,
						canvas.width,
						canvas.height,
						0,
						0,
						scaledWidth,
						scaledHeight
					);
				}
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

	$: if (isActive && videoElement && canvasElement && displayCanvasElement) {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		startProcessing();
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
			{scale}
			bind:videoElement
			bind:canvasElement
			bind:displayCanvasElement
			on:start={startCamera}
		/>

		{#if showSettings && isActive}
			<SettingsPanel {isMobile} bind:selectedPalette bind:scale />
		{/if}

		{#if isActive}
			<BottomBar {isMobile} on:capture={capturePhoto} />
		{/if}
	</div>
</div>
