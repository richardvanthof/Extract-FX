export type Exclusion = {
  id: string;
  effect: string | null;
};

export type SourceData = {
  type: 'RS-FX-EXCHANGE';
  track: number;
  sequence: string;
  exclusions: string[];
  clips: object[];
};

type Globals = {
  ingest: {
    targetTrack: number,
    data: SourceData | null,
    exclusions: Exclusion[]
  },
  extract: {
    exclusions: Exclusion[],
    destination: "file" | "sequence",
    sourceTrack: number,
  },
  exclusionOptions: [],
  trackTotal: number,
  isExclusionModalOpen: boolean,
}

export const globals: Globals = $state({
  ingest: {
    targetTrack: 1,
    data: null,
    exclusions: []
  },
  extract: {
    exclusions: [],
    destination: "file",
    sourceTrack: 1,
  },
  exclusionOptions: [],
  trackTotal: 10,
  isExclusionModalOpen: true,
});
