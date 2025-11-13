// src/lib/utils/settingsStore.ts
import Cookies from 'js-cookie';
import { writable } from 'svelte/store';

export interface CameraSettings {
	scale: number;
	pixelSize: number;
	selectedPalette: string;
	exposure: number;
	customPalettes: Record<string, [number, number, number][]>;
}

const defaultSettings: CameraSettings = {
	scale: 1,
	pixelSize: 10,
	selectedPalette: 'none',
	exposure: 1,
	customPalettes: {}
};

// Load from cookie if exists
const saved = Cookies.get('cameraSettings');
const initialSettings: CameraSettings = saved ? JSON.parse(saved) : defaultSettings;

export const settings = writable<CameraSettings>(initialSettings);

// Persist whenever it changes
settings.subscribe((value) => {
	Cookies.set('cameraSettings', JSON.stringify(value), { expires: 365 });
});