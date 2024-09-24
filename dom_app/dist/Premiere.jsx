var qe = app.enableQE();
var updateUI = 1;
$._PPP_ = {
    message: function (msg) {
        $.writeln(msg);
    },
    updateEventPanel: function (msg, type) {
        $._PPP_.message(msg);
        app.setSDKEventMessage(msg, type);
    },
    searchForFileWithName: function (nameToFind) {
        var numItemsAtRoot = app.project.rootItem.children.numItems;
        var foundFile = null;
        for (var i = 0; (numItemsAtRoot > 0) && (i < numItemsAtRoot) && (foundFile === null); i++) {
            var currentItem = app.project.rootItem.children[i];
            if ((currentItem) && currentItem.name == nameToFind) {
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
        app.project.importFiles(file, suppressWarnings, app.project.getInsertionBin(), importAsStills);
    },
    getAdjustmentLayer: function () {
        var fileName = 'RSFX-container';
        var path;
        var foundFile = $._PPP_.searchForFileWithName(fileName);
        if (Folder.fs == 'Macintosh') {
            path = '/Library/Application Support/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
        }
        else {
            path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
        }
        if (foundFile === null) {
            $._PPP_.message("File not found. Importing...");
            $._PPP_.importFile(path);
            foundFile = $._PPP_.searchForFileWithName(fileName);
            if (foundFile === null) {
                throw "Failed to import the file.";
            }
            else {
                $._PPP_.message("File imported successfully.");
            }
        }
        else {
            $._PPP_.message("File found in the project.");
        }
        return foundFile;
    },
    sanitized: function (effect) {
        if (effect.toLowerCase() === 'motion' ||
            effect.toLowerCase() === 'opacity') {
            return 'Transform';
        }
        else if (
            effect.toLowerCase() === 'AE.ADBE Motion'.toLowerCase() ||
            effect.toLowerCase() === 'AE.ADBE Opacity'.toLowerCase()) {
            return 'AE.ADBE Transform';
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
                var isDuplicate = (name_1.toLowerCase() === filterName.toLowerCase()) &&
                    (filterName.toLowerCase() === currentFxName.toLocaleLowerCase());
                if (isDuplicate) {
                    return false;
                }
            }
        }
        return true;
    },
    copySettings: function (sourceEffect, targetClip) {
        function findByName(list, query, keyName) {
            if (list && list.components) { // Check if list and list.components exist
                for (var i = 0; i < list.components.numItems; i++) { // Using numItems is safer
                    var component = list.components[i];
                    if (component[keyName || 'displayName'] === query) {
                        return component;
                    }
                }
            } else {
                $._PPP_.message('- Error: list or list.components is undefined.');
            }
            return null;
        }
    
        try {
            var sourceComp = sourceEffect;
            var targetComponent = findByName(targetClip, $._PPP_.sanitized(sourceComp.matchName), 'matchName');
            if (targetComponent !== null) {
                for (var _i = 0, _a = sourceComp.properties; _i < _a.length; _i++) {
                    var sourceProp = _a[_i];
                    var targetProp = findByName(targetComponent, sourceProp.displayName);
                    if (targetProp !== null) {
                        if (targetProp.areKeyframesSupported()) {
                            $.writeln('setting keyframes...');
                            for (var k = 0; k < targetProp.keyframes.length; k++) {
                                var currentKeyframe = sourceProp.keyframes[k];
                                var newTime = currentKeyframe[0];
                                var newValue = currentKeyframe[1];
                                var add = targetProp.addKey(newTime, updateUI);
                                if (add === 0) {
                                    targetProp.setValueAtKey(newTime, newValue, updateUI);
                                }
                            }
                        } else {
                            $.writeln('setting static value...');
                            var newValue = sourceProp.value;
                            targetProp.setValue(newValue, updateUI);
                        }
                    } else {
                        throw "Effect property of " + sourceProp.displayName + " of " + sourceComp.displayName + " not found.";
                    }
                }
            } else {
                throw "Component (aka. effect) '" + sourceComp.matchName + "' as '" + $._PPP_.sanitized(sourceComp.matchName) + "' not found.";
            }
            return true;
        } catch (err) {
            $._PPP_.message('- Error during copySettings: ' + err.message);
            throw err;
        }
    },
    copyClipEffectsToAdjustmentLayers: function (track) {
        try {
            $._PPP_.updateEventPanel('Initializing effect extraction...', 'info');
            var adjustmentLayer = $._PPP_.getAdjustmentLayer();
            function findVideoTrack(index) {
                var videoTrack = app.project.activeSequence.videoTracks[index];
                return videoTrack ? videoTrack : null;
            }
            var sequence = app.project.activeSequence;
            if (!sequence) {
                alert("No active sequence found.");
                return;
            }
            var sourceTrackIndex = track | 1;
            var targetTrackIndex = sourceTrackIndex + 1;
            var sourceTrack = findVideoTrack(sourceTrackIndex - 1);
            var targetTrack = findVideoTrack(targetTrackIndex - 1);
            var qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex - 1);
            if (!sourceTrack || !targetTrack) {
                throw "Please ensure the source and target tracks exist.";
                return;
            }
            for (var c = 0; c < sourceTrack.clips.numItems; c++) {
                var sourceClip = sourceTrack.clips[c];
                var targetClip = targetTrack.clips[c];
                var clipEffects = sourceClip.components;
                var startTime = sourceClip.start;
                $._PPP_.updateEventPanel("Moving effect from clip " + c + " of " + sourceTrack.clips.numItems + ".", 'info');
                if (clipEffects.numItems > 0) {
                    var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
                    if (inserted) {
                        var adjustmentLyrQE = qeTargetTrack.getItemAt(c + 1);
                        var adjustmentLayer_1 = $._PPP_.findInsertedClip(targetTrack, startTime);
                        adjustmentLayer_1.end = sourceClip.end;
                        for (var ce = 0; ce < clipEffects.numItems; ce++) {
                            var effect = clipEffects[ce];
                            var effectName = $._PPP_.sanitized(effect.displayName);
                            var newEffect = qe.project.getVideoEffectByName(effectName);
                            var effectAdded = void 0;

                            $._PPP_.message($._PPP_.sanitized(effect.matchName))

                            if ($._PPP_.notDuplicateFx('Transform', effectName, adjustmentLyrQE)) {
                                effectAdded = adjustmentLyrQE.addVideoEffect(newEffect);
                            }
                            else {
                                $._PPP_.message('- Skipped duplicate effect.');
                                effectAdded = false;
                            }
                            if (effectAdded) {
                                var settingsAdded = $._PPP_.copySettings(effect, targetClip);
                                if (!settingsAdded) {
                                    $._PPP_.message('- Error occured while adding effect settings.');
                                }
                            }
                        }
                    }
                }
            }
            $._PPP_.updateEventPanel('Finished copying effects', 'info');
            return true;
        }
        catch (err) {
            $._PPP_.updateEventPanel(err, 'error');
            alert(err);
            return new Error(err);
        }
    },
};
$._PPP_.copyClipEffectsToAdjustmentLayers(1);
