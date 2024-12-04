import { cep_node, cep, __adobe_cep__ } from "./lib/cep-types";

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.svg";

declare global {
  interface Window {
    cep_node: cep_node;
    cep: cep;
    __adobe_cep__: __adobe_cep__;
  }
}

declare const __EXTRACT_FX_VERSION__: string;

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