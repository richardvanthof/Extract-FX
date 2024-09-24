var qe = app.enableQE();
var updateUI = 1;
var $;
(function ($) {
})($ || ($ = {}));
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
            path = '/Library/Application Support/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
        }
        else {
            path = 'file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
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
    copySettings: function (sourceEffect, targetClip) {
        try {
            $._PPP_.message("Finding targetEffect for sourceEffect '" + sourceEffect.matchName + "'");
            var targetComponent = $._PPP_.findComponentByName(targetClip.components, $._PPP_.sanitized(sourceEffect.matchName), 'matchName');
            if (targetComponent) {
                if (targetComponent.matchName === "AE.ADBE Geometry") {
                    var uniformScaleProp = $._PPP_.findComponentByName(targetComponent.properties, 'Uniform Scale');
                    if (uniformScaleProp) {
                        if (!uniformScaleProp.getValue()) {
                            uniformScaleProp.setValue(true, updateUI);
                            $._PPP_.message("- 'Uniform Scale' set to true for Transform effect.");
                        }
                    }
                }
                for (var _i = 0, _a = sourceEffect.properties; _i < _a.length; _i++) {
                    var sourceProp = _a[_i];
                    $._PPP_.message("- Copying setting '" + sourceProp.displayName + "' for effect " + sourceEffect.matchName);
                    var targetProp = $._PPP_.findComponentByName(targetComponent.properties, sourceProp.displayName);
                    if (targetProp) {
                        if (targetProp.areKeyframesSupported() &&
                            (sourceProp.numKeyframes > 0)) {
                            $.writeln('setting keyframes...');
                            for (var k = 0; k < targetProp.keyframes.length; k++) {
                                var currentKeyframe = sourceProp.keyframes[k];
                                var newTime = currentKeyframe[0];
                                var newValue = currentKeyframe[1];
                                var add = targetProp.addKey(newTime, updateUI);
                                if (add === 0) {
                                    var isSet = targetProp.setValueAtKey(newTime, newValue, updateUI);
                                    if (isSet !== 0)
                                        continue;
                                }
                            }
                        }
                        else {
                            $.writeln('setting static value...');
                            var newValue = sourceProp.getValue();
                            var isSet = targetProp.setValue(newValue, updateUI);
                            if (isSet !== 0)
                                continue;
                        }
                    }
                    else {
                        $._PPP_.message(sourceEffect.matchName + ": " + sourceProp.displayName + " setting skipped.", 'warning');
                    }
                }
            }
            else {
                throw "Component (aka. effect) " + sourceEffect.displayName + " not found.";
            }
            return true;
        }
        catch (err) {
            $._PPP_.message('- Error during copySettings: ' + err);
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
                $._PPP_.updateEventPanel("Moving effects from clip " + c + " of " + sourceTrack.clips.numItems + ".", 'info');
                if (clipEffects.numItems > 0) {
                    var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
                    var targetClip = targetTrack.clips[c];
                    if (inserted) {
                        var adjustmentLyrQE = qeTargetTrack.getItemAt(c + 1);
                        var adjustmentLayer_1 = $._PPP_.findInsertedClip(targetTrack, startTime);
                        adjustmentLayer_1.end = sourceClip.end;
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
                                var settingsAdded = $._PPP_.copySettings(effect, targetClip);
                                if (!settingsAdded) {
                                    $._PPP_.message('- Error occurred while adding effect settings.');
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
