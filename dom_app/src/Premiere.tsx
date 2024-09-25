// Enable Adobe Query Engine (QE) API
const qe = app.enableQE();
const updateUI = 1;

// Custom namespace to avoid conflicts with other libraries
// namespace $ {
//   export let _PPP_: {
//     message: (msg: string) => void;
//     updateEventPanel: (msg: string, type: 'info' | 'warning' | 'error') => void;
//     searchForFileWithName: (nameToFind: string) => ProjectItem | null;
//     findInsertedClip: (track: Track, startTime: Time) => TrackItem | null;
//     importFile: (path: string) => void;
//     getAdjustmentLayer: () => ProjectItem;
//     sanitized: (effect: string) => string;
//     notDuplicateFx: (filterName: string, currentFxName: string, QEclip: any) => boolean;
//     findComponentByName: (list: ComponentCollection, query: string, keyName?: string) => Component | null;
//     copySettings: (sourceEffect: Component, targetClip: TrackItem) => boolean;
//     copyClipEffectsToAdjustmentLayers: (track: number) => boolean;
//   };
// }

type fxObj = {
	name: string,
	matchName: string
}

// Define the methods
$._PPP_ = {
  message: function (msg: string): void {
    $.writeln(msg);
  },

  updateEventPanel: function (msg: string, type: 'info' | 'warning' | 'error'): void {
    $._PPP_.message(msg);
    app.setSDKEventMessage(msg, type);
  },

	getInstalledEffects: function():string[] {
		const effects =  qe.project.getVideoEffectList();
		$._PPP_.message(effects);
		return effects
	},

  searchForFileWithName: function (nameToFind: string): ProjectItem | null {
    const numItemsAtRoot = app.project.rootItem.children.numItems;
    let foundFile: ProjectItem | null = null;

    for (let i = 0; i < numItemsAtRoot && foundFile === null; i++) {
      const currentItem = app.project.rootItem.children[i];
      if (currentItem && currentItem.name === nameToFind) {
        foundFile = currentItem;
      }
    }
    return foundFile;
  },

  findInsertedClip: function (track: Track, startTime: Time): TrackItem | null {
    for (const clip of track.clips) {
      if (clip.start.seconds === startTime.seconds) {
        return clip;
      }
    }
    return null;
  },

  importFile: function (path: string): void {
    const file = path; // TODO: convert to relative path.
    const suppressWarnings = true; // Suppress errors
    const importAsStills = false; // Import as image sequence

    app.project.importFiles([file], suppressWarnings, importAsStills);
  },

  getAdjustmentLayer: function (): ProjectItem {
    const fileName = 'RSFX-container';
    let path: string;
    let foundFile = $._PPP_.searchForFileWithName(fileName);
    if (Folder.fs === 'Macintosh') {
      path = '/Library/Application Support/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
    } else {
      path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
    }

    if (foundFile === null) {
      $._PPP_.message('File not found. Importing...');
      $._PPP_.importFile(path);
      foundFile = $._PPP_.searchForFileWithName(fileName);
      if (foundFile === null) {
        throw 'Failed to import the file.';
      } else {
        $._PPP_.message('File imported successfully.');
      }
    } else {
      $._PPP_.message('File found in the project.');
    }
    return foundFile;
  },

  sanitized: function (effect: string): string {
    if (
			effect.toLowerCase() === 'motion' || 
			effect.toLowerCase() === 'opacity'
		) {
      return 'Transform';
    } else if(
			effect.toLowerCase() === 'AE.ADBE Motion'.toLowerCase() || 
			effect.toLowerCase() === 'AE.ADBE Opacity'.toLowerCase()
		) {
			return 'AE.ADBE Geometry' //this is the MatchName for the Transform FX
		} else {
      return effect;
    }
  },

  notDuplicateFx: function (filterName: string, currentFxName: string, QEclip: QEClip): boolean {
    if (QEclip.numComponents > 0) {
      for (let i = 0; i < QEclip.numComponents; i++) {
        const comp = QEclip.getComponentAt(i);
        const name = comp.name;
        const isDuplicate =
          name.toLowerCase() === filterName.toLowerCase() &&
          filterName.toLowerCase() === currentFxName.toLowerCase();
        if (isDuplicate) {
          return false;
        }
      }
    }
    return true;
  },

  findComponentByName: function (list: ComponentCollection, query: string, keyName: string = 'displayName'): Component | null {
    for (const component of list) {
			$._PPP_.message(`-- ${component[keyName]}`)
      if (component[keyName] === query) {
				$._PPP_.message(`-- Match found: ${component[keyName]}`);
        return component;
      }
    }
    return null;
  },

  copySettings: function (sourceEffect: Component, targetClip: TrackItem): boolean {
    try {
      // Find correct effect regardless of order
			$._PPP_.message(`Finding targetEffect for sourceEffect '${sourceEffect.matchName}'`);

      const targetComponent = $._PPP_.findComponentByName(
				targetClip.components,
				$._PPP_.sanitized(sourceEffect.matchName), 
				'matchName'
			);

      if (targetComponent) {

				// Make sure that uniform scale is enables on Transform FX
				if(targetComponent.matchName === "AE.ADBE Geometry") {
					const uniformScaleProp = $._PPP_.findComponentByName(
						targetComponent.properties, 
						'Uniform Scale'
					);
					if (uniformScaleProp) {
						// Ensure 'Uniform Scale' is set to true
						if (!uniformScaleProp.getValue()) {
							uniformScaleProp.setValue(true, updateUI);
							$._PPP_.message(`- 'Uniform Scale' set to true for Transform effect.`);
						}
					}
				}

        // Loop through Properties (aka. effect settings)
        for (const sourceProp of sourceEffect.properties) {
					
					$._PPP_.message(`- Copying setting '${sourceProp.displayName}' for effect ${sourceEffect.matchName}`);
          // Find correct setting regardless of order
          const targetProp = $._PPP_.findComponentByName(targetComponent.properties, sourceProp.displayName);
          if (targetProp) {

            // Check if we need to use keyframes
            if (
							targetProp.areKeyframesSupported() && // Check if parameter support keyframes.
							(sourceProp.numKeyframes > 0) // Check if sourceParam contains keyframes.
						) {
              $.writeln('setting keyframes...');
              // Setting keyframes
              for (let k = 0; k < targetProp.keyframes.length; k++) {
                const currentKeyframe = sourceProp.keyframes[k];
                const newTime = currentKeyframe[0];
                const newValue = currentKeyframe[1];
                const add = targetProp.addKey(newTime, updateUI);
                if (add === 0) {
                  const isSet = targetProp.setValueAtKey(newTime, newValue, updateUI);
									if(isSet !== 0) continue;
                }
              }
             
            } else {
							 // Set static values
              $.writeln('setting static value...');
              const newValue = sourceProp.getValue();
              const isSet = targetProp.setValue(newValue, updateUI);
							if(isSet !== 0) continue;
            }
          } else {
						$._PPP_.message(`${sourceEffect.matchName}: ${sourceProp.displayName} setting skipped.`, 'warning')
            // throw `Effect property of ${sourceProp.displayName} of ${sourceEffect.displayName} not found.`;
          }
        }
      } else {
        throw `Component (aka. effect) ${sourceEffect.displayName} not found.`;
      }

      return true;
    } catch (err) {
      $._PPP_.message('- Error during copySettings: ' + err);
    }
  },

  copyClipEffectsToAdjustmentLayers: function (track: number, exclusions: string[]): boolean {
    try {
      $._PPP_.updateEventPanel(`Track ${track} - Initializing effect extraction...`, 'info');

      // Import adjustment layer
      const adjustmentLayer = $._PPP_.getAdjustmentLayer();

      // Helper function to find a video track by index
      function findVideoTrack(index: number): Track | null {
        const videoTrack = app.project.activeSequence.videoTracks[index];
        return videoTrack ? videoTrack : null;
      }

      // Get the active sequence
      const sequence = app.project.activeSequence;
      if (!sequence) {
        alert('No active sequence found.');
        return false;
      }

      // Define which video track to look for clips and where to put adjustment layers
      const sourceTrackIndex = track || 1; // The track from which to copy effects
      const targetTrackIndex = sourceTrackIndex + 1; // The track where the adjustment layers will be placed

      // Regular ExtendScript API
      const sourceTrack: Track = findVideoTrack(sourceTrackIndex - 1)!;
      const targetTrack: Track = findVideoTrack(targetTrackIndex - 1)!;

      // Adobe Query Engine (QE) API
      const qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex - 1);

      if (!sourceTrack || !targetTrack) {
        throw 'Please ensure the source and target tracks exist.';
      }

      // Iterate over each clip in the source track
      for (let c = 0; c < sourceTrack.clips.numItems; c++) {
        const sourceClip: TrackItem = sourceTrack.clips[c]; // Current clip
        const clipEffects: ComponentCollection = sourceClip.components; // Current clip effects
        const startTime: Time = sourceClip.start; // Start time of clip

        // Status update
        $._PPP_.updateEventPanel(`Moving effects from clip ${c} of ${sourceTrack.clips.numItems}.`, 'info');

        // Check if clip even has effects
        if (clipEffects.numItems > 0) {
          // Create an adjustment layer in the target track
          const inserted: boolean = targetTrack.insertClip(adjustmentLayer, startTime); // Returns true if inserted correctly
					const targetClip: TrackItem = targetTrack.clips[c]; // Current target clip (aka. adjustmente layer)

          if (inserted) {
            // Create link to newly created adjustment layer with QE API
            const adjustmentLyrQE = qeTargetTrack.getItemAt(c + 1); // Did +1 since QE starts counting from 1 instead of 0.
            const adjustmentLayer = $._PPP_.findInsertedClip(targetTrack, startTime);

            // Match the duration of the adjustment layer to the clip
            adjustmentLayer.end = sourceClip.end;

            // COPY ALL EFFECTS TO ADJUSTMENT LAYER
            // Loop over each effect in the source clip
            for (let ce = 0; ce < clipEffects.numItems; ce++) {
              const effect = clipEffects[ce]; // Current effect
              const effectName = $._PPP_.sanitized(effect.displayName); // Current (corrected) effect name
              const newEffect = qe.project.getVideoEffectByName(effectName); // Fetch effect property


              let effectAdded;

              // Check if no duplicate Transform effect is added
              if ($._PPP_.notDuplicateFx('Transform', effectName, adjustmentLyrQE)) {
                effectAdded = adjustmentLyrQE.addVideoEffect(newEffect); // Add effect to adjustment layer
              } else {
                $._PPP_.message('- Skipped duplicate effect.');
                effectAdded = false;
              }

              // Check if effect was added correctly
              if (effectAdded) {
                // Loop over each effect
                const settingsAdded = $._PPP_.copySettings(effect, targetClip);

                if (!settingsAdded) {
                  $._PPP_.message('- Error occurred while adding effect settings.');
                }
              }
            }
          }
        }
      }

      $._PPP_.updateEventPanel('Finished copying effects', 'info');
      
    } catch (err) {
      $._PPP_.updateEventPanel(err, 'error');
      alert(err);
      return err;
    }
		return true;
  },
};

// Start copying effects to adjustment layers from track 1
// $._PPP_.message($._PPP_.getInstalledEffects())
// $._PPP_.copyClipEffectsToAdjustmentLayers(1,['Lumetri Color', 'Warp Stabilizer']);
