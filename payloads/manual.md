# RS Extract-fx

A project by [Richard van 't Hof](https://therichard.space)

## ![program](program.png)

## What is it for?

*RS Extract-fx* is a Premiere Pro plugin that automates mass moving video effects to 'adjustment layers' just above the clip. This is especially useful while prepping for color grading in programs like Davinci Resolve. Once reimported, the effects can be restored by placing the processed footage under the generated adjustment layers. 

## What effects are supported?
>  **Transitions, opacity and audio effects are not supported**
- `Motion`-effects (position, scale, rotation etc.)
- Other video effects from the `effects`-panel

## Controls

- **Source track**: select the video track you would like to extract effects from. Make sure you've simplified your footage to one video track.
- **Remove effects from source clips**: removes all attributes from the original video clips after the effects have been copied.
- **Back-up original sequence:** duplicates the current sequence before processing. This enables you te revert to your original sequence in case an error occurs.
- `Extract`-button: this button starts the copying process.
- `?`-button: Help-button that opens the plugin's manual. 

## Troubleshooting

