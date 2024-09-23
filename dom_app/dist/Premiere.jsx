var qe = app.enableQE();
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
        else {
            return effect;
        }
    },
    notDuplicateFx: function (filterName, currentFxName, QEclip) {
        if (QEclip.numComponents > 0) {
            for (var i = 0; i < QEclip.numComponents; i++) {
                var comp = QEclip.getComponentAt(i);
                var name_1 = comp.name;
                var isDuplicate = (name_1.toLowerCase() === filterName.toLowerCase()) && (filterName.toLowerCase() === currentFxName.toLocaleLowerCase());
                if (isDuplicate) {
                    return false;
                }
            }
        }
        return true;
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
            var copySettings = function (sourceClip, adjustmentLyrQE) {
                try {
                    $._PPP_.message('- Adding effect settings');
                    var sourceEffects = sourceClip.components;
                    for (var se = 0; se < sourceEffects; se++) {
                        var sourceEffect = sourceEffects[se];
                        var targetEffect = adjustmentLyrQE.getComponentAt(se);
                        var sourceProperties = sourceEffects.properties;
                        var targetProperties = targetEffect.properties;
                        for (var pr = 0; pr < sourceProperties.numItems; pr++) {
                            var sourceProp = sourceProperties[pr];
                            var targetProp = targetProperties[pr];
                            if (p >= sourceProperties.numItems) {
                                $._PPP_.message("Property index out of range for effect: " + sourceEffect.displayName);
                                continue;
                            }
                            if (!sourceProp.isEffect && !sourceProp.isReadOnly) {
                                if (sourceProp.isTimeVarying()) {
                                    for (var k = 0; k < sourceProp.numKeys; k++) {
                                        var keyTime = sourceProp.getKeyTime(k);
                                        var keyValue = sourceProp.getValueAtKey(k);
                                        targetProp.setValueAtKey(keyTime.seconds, keyValue);
                                    }
                                }
                                else {
                                    targetProp.setValue(sourceProp.getValue());
                                }
                            }
                        }
                    }
                }
                catch (err) {
                    throw err;
                }
                return true;
            };
            for (var c = 0; c < sourceTrack.clips.numItems; c++) {
                var clip = sourceTrack.clips[c];
                var clipEffects = clip.components;
                var startTime = clip.start;
                $._PPP_.updateEventPanel("Moving effect from clip " + c + " of " + sourceTrack.clips.numItems + ".", 'info');
                if (clipEffects.numItems > 0) {
                    var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
                    if (inserted) {
                        var adjustmentLyrQE = qeTargetTrack.getItemAt(c + 1);
                        var adjustmentLayer_1 = $._PPP_.findInsertedClip(targetTrack, startTime);
                        adjustmentLayer_1.end = clip.end;
                        for (var ce = 0; ce < clipEffects.numItems; ce++) {
                            var effect = clipEffects[ce];
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
                                var settingsAdded = copySettings(clip, adjustmentLyrQE);
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
