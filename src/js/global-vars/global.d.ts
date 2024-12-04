// global.d.ts
declare global {
    interface Global {
        $destination: 'file' | 'track';  // Or use your specific type here
        $exclusions: any[];  // Or replace `any[]` with the correct type
        $exclusionOptions: string[];  // Adjust this based on the actual structure
        $sourceTrack: number;
        $trackTotal: number;
    }

    // Augment globalThis with the custom properties
    interface GlobalThis {
        $destination: 'file' | 'track';
        $exclusions: any[]; // Adjust type as needed
        $exclusionOptions: string[];
        $sourceTrack: number;
        $trackTotal: number;
    }
}

// This is necessary to make the types available globally
export {};
