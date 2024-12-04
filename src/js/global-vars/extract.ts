import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { defaultEffects } from "./shared";
import { Exclusion } from "./shared";

export const sourceTrack: Writable<number> = writable(1);
export const destination: Writable<"file" | "track"> = writable("file");
export const exclusions: Writable<Exclusion[]> = writable([]);
export const exclusionOptions: Writable<string[]> = writable(defaultEffects);
export const isExclusionModalOpen: Writable<boolean> = writable(true);
