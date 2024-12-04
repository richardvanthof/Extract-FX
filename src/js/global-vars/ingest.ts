import { writable } from 'svelte/store';
import type { Writable } from "svelte/store"
import {defaultEffects, defaultTrackAmount} from './shared';
import { Exclusion } from './shared';



const targetTrack:Writable<number> = writable(1);
const sourceData:Writable<object | null> = writable(null);
const exclusions:Writable<Exclusion[]> = writable([]);
const exclusionOptions:Writable<string[]> = writable(defaultEffects)
const isExclusionModalOpen:Writable<boolean> = writable(true);

export {targetTrack, sourceData, exclusions, exclusionOptions, isExclusionModalOpen};
export {targetTrack, sourceData, exclusions, exclusionOptions, isExclusionModalOpen};