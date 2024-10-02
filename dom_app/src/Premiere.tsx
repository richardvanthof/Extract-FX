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
      path = '/Library/Application Support/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/adjustment-layer.prproj';
    } else {
      path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/adjustment-layer.prproj';
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
    // Replace Opacity and Motion effect with Transform FX
    if (
			effect.toLowerCase() === 'motion' || 
			effect.toLowerCase() === 'opacity'
		) {
      return 'Transform';
    } else if(
			effect.toLowerCase() === 'AE.ADBE Motion'.toLowerCase() || 
			effect.toLowerCase() === 'AE.ADBE Opacity'.toLowerCase()
		) {
			return 'AE.ADBE Geometry' // this is the MatchName (aka. internal effect ID) for the Transform FX
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
    // Loop through component collection list and search for a specified item.
    for (const component of list) {
			$._PPP_.message(`-- ${component[keyName]}`)
      if (component[keyName] === query) {
				$._PPP_.message(`-- Match found: ${component[keyName]}`);
        return component;
      }
    }
    return null;
  },
  listContains: function(query: string, filter: string[]):boolean {
    for(let filterItem of filter) if(filterItem.toLowerCase() === query.toLowerCase()) {return true}
    return false;
  },

  copySetting: function(sourceProp:ComponentParam, targetProp:ComponentParam):0|null{
    try {
      let isSet = null;
    
      // Check if we need to use keyframes
      if (
        targetProp.areKeyframesSupported() &&   // Check if parameter supports keyframes.
        sourceProp.getKeys()                   // Check if sourceParam contains keyframes.
      ) {
        const keyframes = sourceProp.getKeys()
        $.writeln('setting keyframes...');
        targetProp.setTimeVarying(true);
        // Setting keyframes
        for (let keyframeTime of keyframes ) {
          const keyframeValue = sourceProp.getValueAtKey(keyframeTime);
          targetProp.addKey(keyframeTime);
          targetProp.setValueAtKey(keyframeTime, keyframeValue, updateUI);
        }
      
      } else {

        // Set static values
        $.writeln('setting static value...');
        const newValue = sourceProp.getValue();
        isSet = targetProp.setValue(newValue, updateUI);
      }
      return isSet;
    } catch(err){
      $._PPP_.message('ERROR Copysetting(): ' + err);
      return err
    }
  },

  copySettings: function (sourceEffect: Component, targetClip: TrackItem): boolean {
    try {
      const sourceFxName = $._PPP_.sanitized(sourceEffect.matchName)
      // Find correct effect regardless of order
			$._PPP_.message(`Finding targetEffect for sourceEffect '${sourceFxName}' (${sourceEffect.matchName})`);

      const targetComponent = $._PPP_.findComponentByName(
				targetClip.components,
				$._PPP_.sanitized(sourceEffect.matchName), 
				'matchName'
			);

      if (targetComponent) {

				// //Make sure that uniform scale is enables on Transform FX
				// if(targetComponent.matchName === "AE.ADBE Geometry") {
				// 	const uniformScaleProp = $._PPP_.findComponentByName(
				// 		targetComponent.properties, 
				// 		'Uniform Scale'
				// 	);
				// 	if (uniformScaleProp) {
				// 		// Ensure 'Uniform Scale' is set to true
				// 		if (!uniformScaleProp.getValue()) {
				// 			uniformScaleProp.setValue(true, updateUI);
				// 			$._PPP_.message(`- 'Uniform Scale' set to true for Transform effect.`);
				// 		}
				// 	}
				// }

        // Loop through Properties (aka. effect settings)
        for (const sourceProp of sourceEffect.properties) {
					if(sourceProp.displayName.length <= 1) {continue; }; // skip effect setting if it has no name.
					$._PPP_.message(`\n- Copying setting '${sourceProp.displayName}' for effect ${$._PPP_.sanitized(sourceEffect.matchName)}`);
          
          if(
            sourceProp.displayName.toLowerCase() === 'scale' &&  // Check if we're reading the scale setting from source
            targetComponent.matchName === "AE.ADBE Geometry" // Check if this setting is for the Transform effect.
          ) {
            // Copy scale property twice from Motion to 'scale width' and 'scale height' in Transform-effect.
            // BUG: this condition makes everything go out of sync for some reason.
            const scaleProps:string[] = ['Scale Width', 'Scale Height']
            for(let scaleProp of scaleProps) {
              const targetProp = $._PPP_.findComponentByName(targetComponent.properties, scaleProp);
              if(targetProp){$._PPP_.copySetting(sourceProp, targetProp)}
            }
            continue;
          } else if (
            // Skip Opacity setting in Transform effect
            targetComponent.matchName === "AE.ADBE Geometry" &&
            sourceProp.displayName.toLowerCase() === 'opacity'
          ) {
            continue;
          } else {
            // If not: continue normally
            const targetProp = $._PPP_.findComponentByName(targetComponent.properties, sourceProp.displayName);
            if(targetProp) {$._PPP_.copySetting(sourceProp, targetProp)}
            continue;
          }
        }
      } else {
        throw `Component (aka. effect) ${sourceEffect.displayName} as ${$._PPP_.sanitized(sourceEffect.displayName)} not found.`;
      }

      return true;
    } catch (err) {
      alert(err)
      $._PPP_.message('ERROR copySettings(): ' + err);
    }
  },
  

  copyClipEffectsToAdjustmentLayers: function (track: number, userExclusions: string[]): boolean {
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
        $._PPP_.updateEventPanel(`\n\nMoving effects from clip ${c} of ${sourceTrack.clips.numItems}.`, 'info');

        // CHECK IF CLIP EVEN HAS EFFECTS
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
              
              // SKIP EXCLUDED EFFECTS
              let exclusions:string[] = ['Opacity'] // default exclusions.
              if(userExclusions) {exclusions.concat(userExclusions); };
              $._PPP_.message(`Exlusions list: ${exclusions}`)
              const skipEffect:boolean = $._PPP_.listContains(effect.displayName, exclusions);
              if(skipEffect === false) {

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


// CALL FUNCTIONS DIRECTLY (ONLY FOR DEBUGGING VIA 'LAUNCH SCRIPT IN EXTENDSCROPT')
// Uncomment function and start debugger to test.

// Output all installed Effects
// $._PPP_.message($._PPP_.getInstalledEffects())

// Start copying effects to adjustment layers from track 1 (we're counting from 1)
 $._PPP_.copyClipEffectsToAdjustmentLayers(1,['Lumetri Color', 'Warp Stabilizer']);
