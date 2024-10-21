// Enable Adobe Query Engine (QE) API
const qe = app.enableQE();
const updateUI = 1;
const debug = true // Set to false when deploying for production.

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

  importFile: function (path: string): boolean {
    try {
      const file = path; // TODO: convert to relative path.
      const supressUI = true; // Suppress errors
      const importAsStills = false; // Import as image sequence
      const targetBin = app.project.rootItem;
      const imported = app.project.importFiles(file, supressUI, targetBin, importAsStills);
      return imported;
    }catch(err){
      return err
    }
    
  },

  getAdjustmentLayer: function (): ProjectItem {
    try {
      const fileName = 'RSFX-container';
      let path: string;
      let importedFile;
      let foundFile = $._PPP_.searchForFileWithName(fileName);
      
      if (Folder.fs === 'Macintosh') {
        path = '/Library/Application Support/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/payloads/adjustment-layer.prproj';
      } else {
        path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/adjustment-layer.prproj';
      }

      if (foundFile === null) {
        $._PPP_.message('File not found. Importing...');
        importedFile = $._PPP_.importFile(path);
        foundFile = $._PPP_.searchForFileWithName(fileName);
        if(foundFile === null) {
          $._PPP_.message('File not found. Importing...');
          importedFile = $._PPP_.importFile(path);
          foundFile = $._PPP_.searchForFileWithName(fileName);
          if(foundFile === null) { throw "Adjustment layer template not found. Try again or manually create a template file."}
        }
      } else {
        $._PPP_.message('File found in the project.');
      }
      return foundFile;
    } catch (err) {
      alert(err);
      return err;
    }
    
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
    $._PPP_.message(`Finding match for ${query}`)
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

  getEffects: function(clip: TrackItem) {
    var effects = {};
    for (let effect of clip.components) {
        
        // GET EFFECT NAME
        var effectName = effect.displayName;
        var fxContainer = effects[effectName]= {};
        
        // GET SETTING NAMES
        for (let setting of effect.properties){

            // Get FX setting name
            var settingName = setting.displayName;
            fxContainer[settingName] = {};
            
            // GET SETTING VALUE (keyframes or static)
            if (
                setting.areKeyframesSupported() && 
                setting.getKeys()
                ){
                
                // Get Keyframes
                var keyFrames = [];

                for (let keyTime of setting.getKeys()) {
                    var keyValue = setting.getValueAtKey(keyTime);
                    keyFrames.push([keyTime, keyValue])
                };
                fxContainer[settingName].keyframes = keyFrames;

            } else {
                // Get static value (if keyframes are not available);
                var value = setting.getValue();
                fxContainer[settingName].value = value;
            }
        }
    }
    return effects;
  },

  getSep : function () {
		if (Folder.fs === 'Macintosh') {
			return '/';
		} else {
			return '\\';
		}
	},

  saveEffectstoFile: function(track: number = 1, userExclusions: string[] = []): boolean {
    
    try {
      const sequence = app.project.activeSequence;
      let sessionCounter	= 1;
      const originalPath	= app.project.path;
      const seqName = sequence.name
      // Get the active sequence
      
      if (!sequence) {
        alert('No active sequence found.');
        return false;
      }

      const effectsList = [];

      // Define which video track to look for clips and where to put adjustment layers
      const sourceTrackIndex = track - 1; // The track from which to copy effects
      const sourceTrack: Track = sequence.videoTracks[sourceTrackIndex]

      if (!sourceTrack) {
        throw 'Please ensure the sourcetracks exist.';
      }

      for(let clip of sourceTrack.clips) {
        const clipEffects = $._PPP_.getEffects(clip)
        effectsList.push(clipEffects)
        $._PPP_.message(clipEffects)
      }

      const outputFile = {
        type: 'RS-FX-EXCHANGE',
        track: track,
        sequence: seqName,
        exclusions: userExclusions,
        clips: effectsList
      }

      // Convert JSON object to string
      var jsonString = JSON.stringify(outputFile);

      // Open a Save Dialog
      var file = File.saveDialog("Save effects list", "*.json"); // Open dialog to save file with .json extension
      file.type = 'rsfx';

      if (file) {
          // If the user chooses a file
          if (file.open("w")) {
              file.write(jsonString); // Write the JSON string to the selected file
              file.close();           // Close the file to save changes
          } else {
              alert("Failed to open the file for writing.");
          }
      } else {
          alert("No file selected.");
      }

      return true;
    } catch(err) {
      throw err;
      alert(err);
    }
   
  },

  copyClipEffectsToAdjustmentLayers: function (track: number, userExclusions: string[] = []): boolean {
    
    const saveType: 'file' | 'layer' = 'file';

    try {
      $._PPP_.updateEventPanel(`Track ${track} - Initializing effect extraction...`, 'info');

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

      if(sourceTrack.clips.numItems <= 0) { throw "No clips on source track were found."}

      // Import adjustment layer
      const adjustmentLayer = $._PPP_.getAdjustmentLayer();

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
  restoreEffectsToClips: function(options:{exclusions: string[], sourceData: Object, targetTrack: number = 1 }) {
    const {
      exclusions,
      sourceData
    } = options;
    
    //Get track
    try {
       // Helper function to find a video track by index
       function findVideoTrack(index: number): Track | null {
        const videoTrack = app.project.activeSequence.videoTracks[index];
        return videoTrack ? videoTrack : null;
      }


      //Get variables
      const sequence = app.project.activeSequence;
      if (!sequence) {
        alert('No active sequence found.');
        return false;
      }

      // Define which video track to look for clips and where to put adjustment layers
      const targetTrackIndex = options.targetTrack - 1; // The track where the adjustment layers will be placed

      // Target track vars
      const targetTrack: Track = findVideoTrack(targetTrackIndex)!;
      const qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex); //QE starts counting from 1.

      if(!targetTrack) { throw 'Target track undefined.'}
      if(!targetTrack.clips) {throw 'Target track has no clips'};

      const sourceClips = sourceData.clips;
      const targetClips = targetTrack.clips;

      //Loop through clips
      for(let c = 0; c <= sourceClips.length && c <= targetClips.numItems; c++) {
        $._PPP_.message(`Restoring efffect for clip ${c} of ${sourceClips.length}`);
        const indexQE = c + 1;
        const sourceClip = sourceClips[c];
        const targetClip = targetClips[c];
        const targetClipQE = qeTargetTrack.getItemAt(indexQE); // Did +1 since QE starts counting from 1 instead of 0.
        
        if(!targetClip) {throw 'Target clip not found.'};
        if(!targetClipQE) {throw 'QE target clip not found.'};

        // Loop through clip effects 
        for(let effectName in sourceClip) {
          
          // SKIP EXCLUDED EFFECTS
          $._PPP_.message(`Exlusions list: ${exclusions}`)
          const skipEffect:boolean = $._PPP_.listContains(effectName, exclusions);
          
          if (skipEffect === false) {
            //Loop through effect settings

            // Skip duplicate effects.
            if(
              effectName.toLowerCase() !== 'motion' && 
              effectName.toLowerCase() !== 'opacity'
            ) {
              // Add video effect
              const newEffect = qe.project.getVideoEffectByName(effectName); // Fetch effect property
              targetClipQE.addVideoEffect(newEffect);
            }
            

            // Vars
            const sourceEffect = sourceClip[effectName];
            const targetEffect = $._PPP_.findComponentByName(targetClip.components, effectName);

            for(let settingName in sourceEffect) {
              const sourceSetting = sourceEffect[settingName];
              const targetSetting = $._PPP_.findComponentByName(targetEffect.properties, settingName)
              //Add effect to targetclip
              if(sourceSetting && targetSetting) {
                if(sourceSetting.keyframes) {
                  targetSetting.setTimeVarying(true); // Enable keyframes
  
                  const {keyframes} = sourceSetting
                  for(let [keyTime, keyValue] of keyframes) {
                    targetSetting.addKey(keyTime.seconds);
                    targetSetting.setValueAtKey(keyTime.seconds, keyValue, updateUI);
                  }
                } else {
                  targetSetting.setValue(sourceSetting.value, updateUI)
                }
              } else {
                throw 'Target or source setting required but not found.'
              }
            }
          }
          
        }
      }

    } catch(err) {
      throw err;
      alert(err);
    }
  }

};


// CALL FUNCTIONS DIRECTLY (ONLY FOR DEBUGGING VIA 'LAUNCH SCRIPT IN EXTENDSCROPT')
// Uncomment function and start debugger to test.

// Output all installed Effects
// $._PPP_.message($._PPP_.getInstalledEffects())

// Start copying effects to adjustment layers from track 1 (we're counting from 1)
// const excl = ['Lumetri Color', 'Warp Stabilizer'];
// const data = JSON.parse('{"type":"RS-FX-EXCHANGE","track":1,"sequence":"My video","exclusions":[],"clips":[{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":152},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"keyframes":[[{"seconds":21.1592955,"ticks":"5374799605728"},[0.5,0.5]],[{"seconds":27.683712,"ticks":"7032105787392"},[0.54560631513596,0.46042093634605]]]},"Scale":{"keyframes":[[{"seconds":21.1592955,"ticks":"5374799605728"},109],[{"seconds":27.683712,"ticks":"7032105787392"},124.3671875]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":2},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"keyframes":[[{"seconds":3599.819769,"ticks":"914411818442304"},100],[{"seconds":3608.759301,"ticks":"916682602602816"},120]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"keyframes":[[{"seconds":3598.4860485,"ticks":"914073032095776"},110],[{"seconds":3605.2627905,"ticks":"915794432991648"},100]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}},"Mosaic":{"Horizontal Blocks":{"keyframes":[[{"seconds":10.4644668333333,"ticks":"2658142007136"},600],[{"seconds":10.4978335,"ticks":"2666617674336"},200],[{"seconds":11.4988334999961,"ticks":"2920887690335"},1]]},"Vertical Blocks":{"keyframes":[[{"seconds":10.4644668333333,"ticks":"2658142007136"},600],[{"seconds":10.4978335,"ticks":"2666617674336"},200],[{"seconds":11.4988334999961,"ticks":"2920887690335"},1]]},"Sharp Colors":{"value":true}}}]}');
// $._PPP_.copyClipEffectsToAdjustmentLayers(1, []);

// $._PPP_.restoreEffectsToClips({
//   exclusions: [],
//   sourceData: data,
//   targetTrack: 1
// })

// $._PPP_.saveEffectstoFile(1);