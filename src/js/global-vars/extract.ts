import { writable } from 'svelte/store';
import type { Writable } from "svelte/store"
import {defaultEffects, defaultTrackAmount} from './shared';

type Exclusion = {
    id: string,
    effect: string
}

const sourceTrack:Writable<number> = writable(1);
const destination:Writable<'file' | 'track'> = writable('file');
const exclusions:Writable<Exclusion[]> = writable([{id: '1', effect: 'Color Replace'}]);
const exclusionOptions:Writable<string[]> = writable(defaultEffects)
const isExclusionModalOpen:Writable<boolean> = writable(true);

export {sourceTrack, destination, exclusions, exclusionOptions, isExclusionModalOpen};
