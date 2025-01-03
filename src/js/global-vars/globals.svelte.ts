const defaultEffects = "Color Balance (RGB),Color Replace,Gamma Correction,Extract,Color Pass,Lens Distortion,Solarize,Convolution Kernel,Levels,MPEG Source Settings,Turbulent Displace,Gradient Wipe,Ultra Key,Vector Motion,Linear Wipe,Twirl,Alpha Adjust,VR Plane to Sphere,Radial Wipe,Change to Color,RGB Curves,Echo,Ramp,Sony Raw Source Settings,Non Red Key,Lighting Effects,Eight-Point Garbage Matte,Color Balance (HLS),Vertical Flip,Broadcast Colors,Wave Warp,Venetian Blinds,Lumetri Color,Bevel Edges,Auto Levels,VR Blur,PRORES RAW Source Settings,Equalize,Shape,Checkerboard,Block Dissolve,Unsharp Mask,VR Glow,Median (Legacy),Set Matte,Set Matte,Auto Color,Spherize,Directional Blur,Difference Matte,Mirror,Noise,Noise,Roughen Edges,Bevel Alpha,Auto Contrast,Luma Corrector,Magnify,Compound Blur,VR Rotate Sphere,Pixel Motion Blur,Rolling Shutter Repair,Timewarp,Three-Way Color Corrector,Clip Name,Arithmetic,Paint Bucket,Fast Blur,Reduce Interlace Flicker,Sixteen-Point Garbage Matte,Replicate,Noise HLS Auto,Noise HLS Auto,Channel Mixer,Motion,MXF/ARRIRAW Development Settings,Alpha Glow,Cineon Converter,Posterize,Transform,Transform,Offset,Canon Cinema RAW Light Source Settings,Fast Color Corrector,ASC CDL,Text,Lightning,Gaussian Blur,Noise HLS,Noise HLS,Color Emboss,ProcAmp,Video Limiter,Black & White,Change Color,Calculations,Remove Matte,Emboss,Grid,Cineon Source Settings,Crop,VR Color Gradients,Circle,Mask2,RGB Color Corrector,RED Source Settings,Find Edges,Tint,Cell Pattern,VR De-Noise,Leave Color,Opacity,Posterize Time,Video Limiter (legacy),Lens Flare,SDR Conform,Eyedropper Fill,Luma Key,Sony RAW MXF Source Settings,Shadow/Highlight,Mask,Sharpen,Brightness & Contrast,Metadata & Timecode Burn-in,Corner Pin,Ellipse,Basic 3D,Drop Shadow,Horizontal Flip,Mosaic,4-Color Gradient,Timecode,Threshold,Threshold,Write-on,Four-Point Garbage Matte,VR Fractal Noise,Strobe Light,Radial Shadow,VR Sharpen,VR Digital Glitch,Color Key,Color Balance,Brush Strokes,CinemaDNG Source Settings,Warp Stabilizer,VR Chromatic Aberrations,Channel Blur,VR Projection,Color Space Transform,Solid Composite,Luma Curve,Dust & Scratches,Simple Text,Track Matte Key,Image Matte Key,Noise Alpha,Noise Alpha,Auto Reframe,Group,Compound Arithmetic,Edge Feather,Invert,ARRIRAW Development Settings,Blend,Texturize".split(',');


export type Exclusion = {
  id: string;
  effect: string | number | null;
};

export type SourceData = {
  type: 'RS-FX-EXCHANGE';
  track: number;
  sequence: string;
  exclusions: string[];
  clips: object[];
  timestamp: string|Date;
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
  exclusionOptions: string[],
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
  exclusionOptions: defaultEffects.sort(),
  trackTotal: 10,
  isExclusionModalOpen: true,
});
