<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
</script>

<svelte:head>
	<title>Pixel Camera</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<meta name="description" content="A pixelated camera app with customizable color palettes." />
	<meta name="theme-color" content="#000" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>
<slot />
