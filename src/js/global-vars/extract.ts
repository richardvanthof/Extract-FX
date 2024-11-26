import { writable } from 'svelte/store';
import type { Writable } from "svelte/store"
import {defaultEffects, defaultTrackAmount} from './shared';

const sourceTrack:Writable<number> = writable(1);
const destination:Writable<'file' | 'track'> = writable('file');
const exclusions:Writable<string[]> = writable([]);
const exclusionOptions:Writable<string[]> = writable(defaultEffects)


export {sourceTrack, trackTotal, destination, exclusions, exclusionOptions};