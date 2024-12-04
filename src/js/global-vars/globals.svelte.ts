export type Exclusion = {
  id: string;
  effect: string | null;
};

interface Globals {
  destination?: "file" | "track";
  exclusions: Exclusion[]; // Adjust type as needed
  exclusionOptions: string[];
  sourceTrack: number;
  trackTotal: number;
  isExclusionModalOpen: boolean;
}

export const globals: Globals = $state({
  destination: "file",
  exclusions: [],
  exclusionOptions: [],
  sourceTrack: 0,
  trackTotal: 0,
  isExclusionModalOpen: false,
});
