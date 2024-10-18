var qe = app.enableQE();
var updateUI = 1;
var debug = true;
$._PPP_ = {
    message: function (msg) {
        if (debug) {
            $.writeln(msg);
        }
        ;
    },
    updateEventPanel: function (msg, type) {
        if (type === void 0) { type = 'info'; }
        $._PPP_.message(msg);
        app.setSDKEventMessage(msg, type);
    },
    getInstalledEffects: function () {
        var effects = qe.project.getVideoEffectList();
        $._PPP_.message(effects);
        return effects;
    },
    searchForFileWithName: function (nameToFind) {
        var numItemsAtRoot = app.project.rootItem.children.numItems;
        var foundFile = null;
        for (var i = 0; i < numItemsAtRoot && foundFile === null; i++) {
            var currentItem = app.project.rootItem.children[i];
            if (currentItem && currentItem.name === nameToFind) {
                foundFile = currentItem;
            }
        }
        return foundFile;
    },
    findInsertedClip: function (track, startTime) {
        for (var _i = 0, _a = track.clips; _i < _a.length; _i++) {
            var clip = _a[_i];
            if (clip.start.seconds === startTime.seconds) {
                return clip;
            }
        }
        return null;
    },
    importFile: function (path) {
        var file = path;
        var suppressWarnings = true;
        var importAsStills = false;
        app.project.importFiles([file], suppressWarnings, importAsStills);
    },
    getAdjustmentLayer: function () {
        var fileName = 'RSFX-container';
        var path;
        var foundFile = $._PPP_.searchForFileWithName(fileName);
        if (Folder.fs === 'Macintosh') {
            path = '/Library/Application Support/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/adjustment-layer.prproj';
        }
        else {
            path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/adjustment-layer.prproj';
        }
        if (foundFile === null) {
            $._PPP_.message('File not found. Importing...');
            $._PPP_.importFile(path);
            foundFile = $._PPP_.searchForFileWithName(fileName);
            if (foundFile === null) {
                throw 'Failed to import the file.';
            }
            else {
                $._PPP_.message('File imported successfully.');
            }
        }
        else {
            $._PPP_.message('File found in the project.');
        }
        return foundFile;
    },
    sanitized: function (effect) {
        if (effect.toLowerCase() === 'motion' ||
            effect.toLowerCase() === 'opacity') {
            return 'Transform';
        }
        else if (effect.toLowerCase() === 'AE.ADBE Motion'.toLowerCase() ||
            effect.toLowerCase() === 'AE.ADBE Opacity'.toLowerCase()) {
            return 'AE.ADBE Geometry';
        }
        else {
            return effect;
        }
    },
    notDuplicateFx: function (filterName, currentFxName, QEclip) {
        if (QEclip.numComponents > 0) {
            for (var i = 0; i < QEclip.numComponents; i++) {
                var comp = QEclip.getComponentAt(i);
                var name_1 = comp.name;
                var isDuplicate = name_1.toLowerCase() === filterName.toLowerCase() &&
                    filterName.toLowerCase() === currentFxName.toLowerCase();
                if (isDuplicate) {
                    return false;
                }
            }
        }
        return true;
    },
    findComponentByName: function (list, query, keyName) {
        if (keyName === void 0) { keyName = 'displayName'; }
        $._PPP_.message("Finding match for " + query);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var component = list_1[_i];
            $._PPP_.message("-- " + component[keyName]);
            if (component[keyName] === query) {
                $._PPP_.message("-- Match found: " + component[keyName]);
                return component;
            }
        }
        return null;
    },
    listContains: function (query, filter) {
        for (var _i = 0, filter_1 = filter; _i < filter_1.length; _i++) {
            var filterItem = filter_1[_i];
            if (filterItem.toLowerCase() === query.toLowerCase()) {
                return true;
            }
        }
        return false;
    },
    copySetting: function (sourceProp, targetProp, config) {
        try {
            var isSet = null;
            var sourceIn = config.sourceIn, targetIn = config.targetIn, sourceRes = config.sourceRes;
            var targetRes = {
                w: app.project.activeSequence.frameSizeHorizontal,
                h: app.project.activeSequence.frameSizeVertical
            };
            function translatePosCoordinates(value, currentEffectName, sourceRes, targetRes) {
                if (currentEffectName.toLowerCase() === 'position') {
                    return [value[0] * (sourceRes.w / targetRes.w), value[1] * (sourceRes.h / sourceRes.h)];
                    ;
                }
                return value;
            }
            if (targetProp.displayName.toLowerCase() === 'position') {
                $._PPP_.message("orginele transform pos: " + targetProp.getValue());
            }
            if (targetProp.areKeyframesSupported() && sourceProp.getKeys()) {
                var keyframes = sourceProp.getKeys();
                $._PPP_.message('Setting keyframes...');
                targetProp.setTimeVarying(true);
                for (var _i = 0, keyframes_1 = keyframes; _i < keyframes_1.length; _i++) {
                    var keyframeTime = keyframes_1[_i];
                    var keyframeValue = sourceProp.getValueAtKey(keyframeTime);
                    7;
                    var adjustedKeyframeTime = new Time();
                    adjustedKeyframeTime.seconds = keyframeTime.seconds - sourceIn.seconds + targetIn.seconds;
                    var adjustedKeyframeValue = translatePosCoordinates(keyframeValue, sourceProp.displayName, sourceRes, targetRes);
                    targetProp.addKey(adjustedKeyframeTime);
                    targetProp.setValueAtKey(adjustedKeyframeTime, adjustedKeyframeValue, updateUI);
                    $._PPP_.message("---- Time: " + adjustedKeyframeTime.seconds + " sec; Value: " + keyframeValue);
                }
            }
            else {
                $._PPP_.message('Setting static value...');
                var staticValue = sourceProp.getValue();
                var adjustedValue = translatePosCoordinates(staticValue, sourceProp.displayName, sourceRes, targetRes);
                if (targetProp && staticValue) {
                    isSet = targetProp.setValue(adjustedValue, updateUI);
                }
                $._PPP_.message("---- Value: " + staticValue);
            }
            return isSet;
        }
        catch (err) {
            $._PPP_.message('ERROR copySetting(): ' + err);
            return null;
        }
    },
    copySettings: function (sourceEffect, targetClip, config) {
        try {
            var sourceFxName = $._PPP_.sanitized(sourceEffect.matchName);
            $._PPP_.message("Finding targetEffect for sourceEffect '" + sourceFxName + "' (" + sourceEffect.matchName + ")");
            var targetComponent = $._PPP_.findComponentByName(targetClip.components, $._PPP_.sanitized(sourceEffect.matchName), 'matchName');
            if (targetComponent) {
                for (var _i = 0, _a = sourceEffect.properties; _i < _a.length; _i++) {
                    var sourceProp = _a[_i];
                    if (sourceProp.displayName.length <= 1) {
                        continue;
                    }
                    ;
                    $._PPP_.message("\n- Copying setting '" + sourceProp.displayName + "' for effect " + $._PPP_.sanitized(sourceEffect.matchName));
                    if (sourceProp.displayName.toLowerCase() === 'scale' &&
                        targetComponent.matchName === "AE.ADBE Geometry") {
                        var scaleProps = ['Scale Width', 'Scale Height'];
                        for (var _b = 0, scaleProps_1 = scaleProps; _b < scaleProps_1.length; _b++) {
                            var scaleProp = scaleProps_1[_b];
                            var targetProp = $._PPP_.findComponentByName(targetComponent.properties, scaleProp);
                            if (targetProp) {
                                $._PPP_.copySetting(sourceProp, targetProp, config);
                            }
                        }
                        continue;
                    }
                    else if (targetComponent.matchName === "AE.ADBE Geometry" &&
                        sourceProp.displayName.toLowerCase() === 'opacity') {
                        continue;
                    }
                    else {
                        var targetProp = $._PPP_.findComponentByName(targetComponent.properties, sourceProp.displayName);
                        if (targetProp) {
                            $._PPP_.copySetting(sourceProp, targetProp, config);
                        }
                        continue;
                    }
                }
            }
            else {
                throw "Component (aka. effect) " + sourceEffect.displayName + " as " + $._PPP_.sanitized(sourceEffect.displayName) + " not found.";
            }
            return true;
        }
        catch (err) {
            alert(err);
            $._PPP_.message('ERROR copySettings(): ' + err);
        }
    },
    getClipResolution: function (clip) {
        var projectItem = clip.projectItem;
        var columnsMetadata = projectItem.getProjectColumnsMetadata();
        if (columnsMetadata.length > 0) {
            var videoInfo = columnsMetadata[0]['premierePrivateProjectMetaData:Column.Intrinsic.VideoInfo'];
            if (videoInfo) {
                var resolutionParts = videoInfo.split(" x ");
                var width = resolutionParts[0];
                var height = resolutionParts[1].split(" ")[0];
                $.writeln("Clip width: " + width);
                $.writeln("Clip height: " + height);
                return {
                    w: width,
                    h: height
                };
            }
            else {
                $.writeln("Video info not found in metadata.");
            }
        }
        else {
            $.writeln("No columns metadata available.");
        }
    },
    getEffects: function (clip) {
        var effects = {};
        for (var _i = 0, _a = clip.components; _i < _a.length; _i++) {
            var effect = _a[_i];
            var effectName = effect.displayName;
            var fxContainer = effects[effectName] = {};
            for (var _b = 0, _c = effect.properties; _b < _c.length; _b++) {
                var setting = _c[_b];
                var settingName = setting.displayName;
                fxContainer[settingName] = {};
                if (setting.areKeyframesSupported() &&
                    setting.getKeys()) {
                    var keyFrames = [];
                    for (var _d = 0, _e = setting.getKeys(); _d < _e.length; _d++) {
                        var keyTime = _e[_d];
                        var keyValue = setting.getValueAtKey(keyTime);
                        keyFrames.push([keyTime, keyValue]);
                    }
                    ;
                    fxContainer[settingName].keyframes = keyFrames;
                }
                else {
                    var value = setting.getValue();
                    fxContainer[settingName].value = value;
                }
            }
        }
        return effects;
    },
    getSep: function () {
        if (Folder.fs === 'Macintosh') {
            return '/';
        }
        else {
            return '\\';
        }
    },
    saveEffectstoFile: function (track, userExclusions) {
        if (track === void 0) { track = 1; }
        if (userExclusions === void 0) { userExclusions = []; }
        try {
            var sequence = app.project.activeSequence;
            var sessionCounter = 1;
            var originalPath = app.project.path;
            var seqName = sequence.name;
            if (!sequence) {
                alert('No active sequence found.');
                return false;
            }
            var effectsList = [];
            var sourceTrackIndex = track - 1;
            var sourceTrack = sequence.videoTracks[sourceTrackIndex];
            if (!sourceTrack) {
                throw 'Please ensure the sourcetracks exist.';
            }
            for (var _i = 0, _a = sourceTrack.clips; _i < _a.length; _i++) {
                var clip = _a[_i];
                var clipEffects = $._PPP_.getEffects(clip);
                effectsList.push(clipEffects);
                $._PPP_.message(clipEffects);
            }
            var outputFile = {
                type: 'RS-FX-EXCHANGE',
                track: track,
                sequence: seqName,
                exclusions: userExclusions,
                clips: effectsList
            };
            var jsonString = JSON.stringify(outputFile);
            var file = File.saveDialog("Save effects list", "*.json");
            file.type = 'rsfx';
            if (file) {
                if (file.open("w")) {
                    file.write(jsonString);
                    file.close();
                }
                else {
                    alert("Failed to open the file for writing.");
                }
            }
            else {
                alert("No file selected.");
            }
            return true;
        }
        catch (err) {
            throw err;
            alert(err);
        }
    },
    copyClipEffectsToAdjustmentLayers: function (track, userExclusions) {
        if (userExclusions === void 0) { userExclusions = []; }
        var saveType = 'file';
        try {
            $._PPP_.updateEventPanel("Track " + track + " - Initializing effect extraction...", 'info');
            var adjustmentLayer = $._PPP_.getAdjustmentLayer();
            function findVideoTrack(index) {
                var videoTrack = app.project.activeSequence.videoTracks[index];
                return videoTrack ? videoTrack : null;
            }
            var sequence = app.project.activeSequence;
            if (!sequence) {
                alert('No active sequence found.');
                return false;
            }
            var sourceTrackIndex = track || 1;
            var targetTrackIndex = sourceTrackIndex + 1;
            var sourceTrack = findVideoTrack(sourceTrackIndex - 1);
            var targetTrack = findVideoTrack(targetTrackIndex - 1);
            var qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex - 1);
            if (!sourceTrack || !targetTrack) {
                throw 'Please ensure the source and target tracks exist.';
            }
            for (var c = 0; c < sourceTrack.clips.numItems; c++) {
                var sourceClip = sourceTrack.clips[c];
                var clipEffects = sourceClip.components;
                var startTime = sourceClip.start;
                $._PPP_.updateEventPanel("\n\nMoving effects from clip " + c + " of " + sourceTrack.clips.numItems + ".", 'info');
                if (clipEffects.numItems > 0) {
                    var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
                    var targetClip = targetTrack.clips[c];
                    var sourceRes = { w: sequence.frameSizeHorizontal, h: sequence.frameSizeVertical };
                    var config = {
                        sourceIn: sourceClip.inPoint,
                        targetIn: targetClip.inPoint,
                        sourceRes: sourceRes
                    };
                    if (inserted) {
                        var adjustmentLyrQE = qeTargetTrack.getItemAt(c + 1);
                        var adjustmentLayer_1 = $._PPP_.findInsertedClip(targetTrack, startTime);
                        adjustmentLayer_1.end = sourceClip.end;
                        for (var ce = 0; ce < clipEffects.numItems; ce++) {
                            var effect = clipEffects[ce];
                            var exclusions = ['Opacity'].concat(userExclusions);
                            $._PPP_.message("Exlusions list: " + exclusions);
                            var skipEffect = $._PPP_.listContains(effect.displayName, exclusions);
                            if (skipEffect === false) {
                                var effectName = $._PPP_.sanitized(effect.displayName);
                                var newEffect = qe.project.getVideoEffectByName(effectName);
                                var effectAdded = void 0;
                                if ($._PPP_.notDuplicateFx('Transform', effectName, adjustmentLyrQE)) {
                                    effectAdded = adjustmentLyrQE.addVideoEffect(newEffect);
                                }
                                else {
                                    $._PPP_.message('- Skipped duplicate effect.');
                                    effectAdded = false;
                                }
                                if (effectAdded) {
                                    var settingsAdded = $._PPP_.copySettings(effect, targetClip, config);
                                    if (!settingsAdded) {
                                        $._PPP_.message('- Error occurred while adding effect settings.');
                                    }
                                }
                            }
                            else {
                                $._PPP_.message("Skipped: " + effect.displayName);
                            }
                        }
                    }
                }
            }
            $._PPP_.updateEventPanel('Finished copying effects', 'info');
        }
        catch (err) {
            $._PPP_.updateEventPanel(err, 'error');
            alert(err);
            return err;
        }
        return true;
    },
    restoreEffectsToClips: function (options) {
        var exclusions = options.exclusions, sourceData = options.sourceData;
        try {
            function findVideoTrack(index) {
                var videoTrack = app.project.activeSequence.videoTracks[index];
                return videoTrack ? videoTrack : null;
            }
            var sequence = app.project.activeSequence;
            if (!sequence) {
                alert('No active sequence found.');
                return false;
            }
            var targetTrackIndex = options.targetTrack - 1;
            var targetTrack = findVideoTrack(targetTrackIndex);
            var qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex);
            if (!targetTrack) {
                throw 'Target track undefined.';
            }
            if (!targetTrack.clips) {
                throw 'Target track has no clips';
            }
            ;
            var sourceClips = sourceData.clips;
            var targetClips = targetTrack.clips;
            for (var c = 0; c < sourceClips.length && c < targetClips.numItems; c++) {
                $._PPP_.message("Restoring efffect for clip " + c + " of " + sourceClips.length);
                var indexQE = c + 1;
                var sourceClip = sourceClips[c];
                var targetClip = targetClips[c];
                var targetClipQE = qeTargetTrack.getItemAt(indexQE);
                if (!targetClip) {
                    throw 'Target clip not found.';
                }
                ;
                if (!targetClipQE) {
                    throw 'QE target clip not found.';
                }
                ;
                for (var effectName in sourceClip) {
                    $._PPP_.message("Exlusions list: " + exclusions);
                    var skipEffect = $._PPP_.listContains(effectName, exclusions);
                    if (skipEffect === false) {
                        if (effectName.toLowerCase() !== 'motion' &&
                            effectName.toLowerCase() !== 'opacity') {
                            var newEffect = qe.project.getVideoEffectByName(effectName);
                            targetClipQE.addVideoEffect(newEffect);
                        }
                        var sourceEffect = sourceClip[effectName];
                        var targetEffect = $._PPP_.findComponentByName(targetClip.components, effectName);
                        for (var settingName in sourceEffect) {
                            var sourceSetting = sourceEffect[settingName];
                            var targetSetting = $._PPP_.findComponentByName(targetEffect.properties, settingName);
                            if (sourceSetting && targetSetting) {
                                if (sourceSetting.keyframes) {
                                    targetSetting.setTimeVarying(true);
                                    var keyframes = sourceSetting.keyframes;
                                    for (var _i = 0, keyframes_2 = keyframes; _i < keyframes_2.length; _i++) {
                                        var _a = keyframes_2[_i], keyTime = _a[0], keyValue = _a[1];
                                        targetSetting.addKey(keyTime.seconds);
                                        targetSetting.setValueAtKey(keyTime.seconds, keyValue, updateUI);
                                    }
                                }
                                else {
                                    targetSetting.setValue(sourceSetting.value, updateUI);
                                }
                            }
                            else {
                                throw 'Target or source setting required but not found.';
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
            throw err;
            alert(err);
        }
    }
};
var data = JSON.parse('{"type":"RS-FX-EXCHANGE","track":1,"sequence":"My video","exclusions":[],"clips":[{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":152},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"keyframes":[[{"seconds":21.1592955,"ticks":"5374799605728"},[0.5,0.5]],[{"seconds":27.683712,"ticks":"7032105787392"},[0.54560631513596,0.46042093634605]]]},"Scale":{"keyframes":[[{"seconds":21.1592955,"ticks":"5374799605728"},109],[{"seconds":27.683712,"ticks":"7032105787392"},124.3671875]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":2},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"keyframes":[[{"seconds":3599.819769,"ticks":"914411818442304"},100],[{"seconds":3608.759301,"ticks":"916682602602816"},120]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"keyframes":[[{"seconds":3598.4860485,"ticks":"914073032095776"},110],[{"seconds":3605.2627905,"ticks":"915794432991648"},100]]},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}}},{"Opacity":{"Opacity":{"value":100},"Blend Mode":{"value":0}},"Motion":{"Position":{"value":[0.5,0.5]},"Scale":{"value":100},"Scale Width":{"value":100},"Uniform Scale":{"value":true},"Rotation":{"value":0},"Anchor Point":{"value":[0.5,0.5]},"Anti-flicker Filter":{"value":0},"Crop Left":{"value":0},"Crop Top":{"value":0},"Crop Right":{"value":0},"Crop Bottom":{"value":0}},"Mosaic":{"Horizontal Blocks":{"keyframes":[[{"seconds":10.4644668333333,"ticks":"2658142007136"},600],[{"seconds":10.4978335,"ticks":"2666617674336"},200],[{"seconds":11.4988334999961,"ticks":"2920887690335"},1]]},"Vertical Blocks":{"keyframes":[[{"seconds":10.4644668333333,"ticks":"2658142007136"},600],[{"seconds":10.4978335,"ticks":"2666617674336"},200],[{"seconds":11.4988334999961,"ticks":"2920887690335"},1]]},"Sharp Colors":{"value":true}}}]}');
$._PPP_.restoreEffectsToClips({
    exclusions: [],
    sourceData: data,
    targetTrack: 1
});
