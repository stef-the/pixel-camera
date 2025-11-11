export const colorPalettes: Record<string, RGB[]> = {
	grayscale: [
		[0, 0, 0],
		[64, 64, 64],
		[128, 128, 128],
		[192, 192, 192],
		[255, 255, 255]
	],
	retro: [
		[0, 0, 0],
		[87, 51, 74],
		[188, 74, 60],
		[255, 163, 0],
		[255, 236, 39]
	],
	gameboy: [
		[15, 56, 15],
		[48, 98, 48],
		[139, 172, 15],
		[155, 188, 15]
	],
	cyberpunk: [
		[0, 0, 0],
		[255, 0, 255],
		[0, 255, 255],
		[255, 0, 128],
		[255, 255, 0]
	],
	pastel: [
		[255, 179, 186],
		[255, 223, 186],
		[255, 255, 186],
		[186, 255, 201],
		[186, 225, 255]
	]
};

type RGB = [number, number, number];

export function nearestColor(r: number, g: number, b: number, palette: RGB[]): RGB {
	let minDist = Infinity;
	let nearest = palette[0];

	for (const color of palette) {
		const dist = Math.sqrt(
			Math.pow(r - color[0], 2) +
				Math.pow(g - color[1], 2) +
				Math.pow(b - color[2], 2)
		);
		if (dist < minDist) {
			minDist = dist;
			nearest = color;
		}
	}

	return nearest;
}
