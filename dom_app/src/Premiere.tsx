// Enable Adobe Query Engine (QE) API
const qe = app.enableQE();
const updateUI = 1;
const debug = false // Set to false when deploying for production.

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

type Resolution = {
  w: number,
  h: number
}

type CopySettingsConfig = {
  sourceIn: Time,
  targetIn: Time,
  sourceRes: Resolution
}



// Define the methods
$._PPP_ = {
  message: function (msg: string): void {
    if(debug) {$.writeln(msg)};
  },

  updateEventPanel: function (msg: string, type: 'info' | 'warning' | 'error' = 'info'): void {
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

  copySetting: function(sourceProp: ComponentParam, targetProp: ComponentParam, config: CopySettingsConfig): 0 | null {
    try {
      let isSet = null;
      const { sourceIn, targetIn, sourceRes } = config;
  
      const targetRes:Resolution = {
        w: app.project.activeSequence.frameSizeHorizontal, // Width of the sequence,
        h: app.project.activeSequence.frameSizeVertical // Height of the sequence
      }
  
      function translatePosCoordinates(
        value: any, 
        currentEffectName: string, 
        sourceRes: Resolution, 
        targetRes: Resolution
      ) {
        if (currentEffectName.toLowerCase() === 'position') {
          return [value[0] * (sourceRes.w / targetRes.w), value[1] * (sourceRes.h / sourceRes.h]);
        }
        return value; // Non-position properties remain unchanged
      }

      if (targetProp.displayName.toLowerCase() === 'position') {
        $._PPP_.message(`orginele transform pos: ${targetProp.getValue()}`); //DEBUG
      }
     
  
      // Check if the property supports keyframes
      if (targetProp.areKeyframesSupported() && sourceProp.getKeys()) {
        const keyframes = sourceProp.getKeys();
        $._PPP_.message('Setting keyframes...');
  
        targetProp.setTimeVarying(true); // Enable keyframes
  
        // Set each keyframe value by converting it to absolute coordinates
        for (let keyframeTime of keyframes) {
          const keyframeValue = sourceProp.getValueAtKey(keyframeTime);
  7
          // Adjust the keyframe time for the target clip
          const adjustedKeyframeTime = new Time();
          adjustedKeyframeTime.seconds = keyframeTime.seconds - sourceIn.seconds + targetIn.seconds;

          const adjustedKeyframeValue = translatePosCoordinates(
            keyframeValue, 
            sourceProp.displayName, 
            sourceRes,
            targetRes
          );

          // Add keyframe to the target and set the converted value
          targetProp.addKey(adjustedKeyframeTime);
          targetProp.setValueAtKey(adjustedKeyframeTime, adjustedKeyframeValue, updateUI);
  
          $._PPP_.message(`---- Time: ${adjustedKeyframeTime.seconds} sec; Value: ${keyframeValue}`);
        }
      } else {
        // Handle the case for static values (no keyframes)
        $._PPP_.message('Setting static value...');
        const staticValue = sourceProp.getValue();

        const adjustedValue = translatePosCoordinates(
          staticValue, 
          sourceProp.displayName, 
          sourceRes,
          targetRes
        );

        if (targetProp && staticValue) {
          isSet = targetProp.setValue(adjustedValue, updateUI);
        }
        $._PPP_.message(`---- Value: ${staticValue}`);
      }
  
      return isSet;
    } catch (err) {
      $._PPP_.message('ERROR copySetting(): ' + err);
      return null;
    }
  },

  copySettings: function (sourceEffect: Component, targetClip: TrackItem, config: CopySettingsConfig ): boolean {
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
              if(targetProp){$._PPP_.copySetting(sourceProp, targetProp, config)}
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
            if(targetProp) {$._PPP_.copySetting(sourceProp, targetProp, config)}
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
  
  getClipResolution: function(clip:TrackItem):Resolution {
    // Get the associated project item
    var projectItem = clip.projectItem;

    // Get the project columns metadata
    var columnsMetadata = projectItem.getProjectColumnsMetadata();

    // Check if we have the metadata and print it out
    if (columnsMetadata.length > 0) {
        // You might need to inspect the keys for your specific version
        var videoInfo = columnsMetadata[0]['premierePrivateProjectMetaData:Column.Intrinsic.VideoInfo'];

        if (videoInfo) {
            // Extract the width and height from the videoInfo string
            var resolutionParts = videoInfo.split(" x ");
            var width = resolutionParts[0];
            var height = resolutionParts[1].split(" ")[0];  // Extract only the height, ignoring any extra info

            // Output the width and height
            $.writeln("Clip width: " + width);
            $.writeln("Clip height: " + height);
            
            return {
              w: width,
              h: height
            }
        } else {
            $.writeln("Video info not found in metadata.");
        }
    } else {
        $.writeln("No columns metadata available.");
    }
  },

  copyClipEffectsToAdjustmentLayers: function (track: number, userExclusions: string[] = []): boolean {
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
          
          const sourceRes:Resolution = {w: sequence.frameSizeHorizontal, h:sequence.frameSizeVertical }

          let config:CopySettingsConfig = { // Get the source clip inPoint on the timeline
            sourceIn: sourceClip.inPoint,
            targetIn: targetClip.inPoint,
            sourceRes: sourceRes
          }
         
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
              let exclusions:string[] = ['Opacity', ...userExclusions] // exclusions.
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
                  const settingsAdded = $._PPP_.copySettings(effect, targetClip, config);

                  if (!settingsAdded) {
                    $._PPP_.message('- Error occurred while adding effect settings.');
                  }
                }
              } else {
                $._PPP_.message(`Skipped: ${effect.displayName}`)
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
const excl = ['Lumetri Color', 'Warp Stabilizer'];
$._PPP_.copyClipEffectsToAdjustmentLayers(1);
