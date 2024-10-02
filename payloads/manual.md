# RS Extract-fx

*RS Extract-fx* is a Premiere Pro plugin that automates mass moving video effects to  'adjustment layers' just above the clip. This is especially useful while prepping for color grading in programs like Davinci Resolve. Once reimported, the effects can be restored by placing the processed footage under the generated adjustment layers.

<video src="preview.webm" loop autoplay></video>

[TOC]


## What effects are supported?

- Other video effects from the `effects`-panel
- `Motion`-effects (position, scale, rotation etc.)
## Not supported
- Transitions, opacity and audio effects are not supported.
-  Lumetri Color and Warp Stabiliser are not recommended due to performance reasons and majorly reduced usability due to the nature of adjustment layers.
## Controls

<img style="margin:0" src="program.png" alt="program"  />

- **Source track**: select the video track you would like to extract effects from. Make sure you've simplified your footage to one video track.
- **Remove effects from source clips**: removes all attributes from the original video clips after the effects have been copied.
- **Back-up original sequence:** duplicates the current sequence before processing. This enables you te revert to your original sequence in case an error occurs.
- `Extract`-button: this button starts the copying process.
- `?`-button: Help-button that opens the plugin's manual. 

## Troubleshooting

- **The adjustment layer does not have the correct properties for my sequence.**
  Manually create an adjustment layer called `RSFX-container` in the root of your project with your custom specs. Make sure to delete all pre-existing files using this name.
- **The created adjustment layers overlap clips on the track above the source track.**
  Manually append a video track to the source track.



A project by [Richard van 't Hof](https://therichard.space)
