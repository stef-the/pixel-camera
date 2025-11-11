// src/lib/utils/settingsStore.ts
import Cookies from 'js-cookie';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { colorPalettes } from './colorUtils';

export interface CameraSettings {
	scale: number;
	pixelSize: number;
	selectedPalette: string;
	customPalettes: Record<string, [number, number, number][]>;
}

const defaultSettings: CameraSettings = {
	scale: 1,
	pixelSize: 10,
	selectedPalette: 'none',
	customPalettes: {}
};

// Load from cookie if exists
const saved = Cookies.get('cameraSettings');
const initialSettings: CameraSettings = saved
	? JSON.parse(saved)
	: defaultSettings;

export const settings: Writable<CameraSettings> = writable(initialSettings);

// Persist whenever it changes
settings.subscribe((value) => {
	Cookies.set('cameraSettings', JSON.stringify(value), { expires: 365 });
});
