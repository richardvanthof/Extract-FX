import { writable } from 'svelte/store';
import type { Writable } from "svelte/store"
import {defaultEffects, defaultTrackAmount} from './shared';

const targetTrack:Writable<number> = writable(1);
const sourceFile:Writable<object | null> = writable(null);
const exclusions:Writable<string[]> = writable([]);
const exclusionOptions:Writable<string[]> = writable(defaultEffects)
const isExclusionModalOpen:Writable<boolean> = writable(true);

export {targetTrack, sourceFile, exclusions, exclusionOptions, isExclusionModalOpen};