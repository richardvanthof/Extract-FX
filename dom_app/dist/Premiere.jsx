var qe = app.enableQE();
function updateEventPanel(msg, type) {
    app.setSDKEventMessage(msg, type);
}
function message(msg) {
    $.writeln(msg);
}
function searchForFileWithName(nameToFind) {
    var numItemsAtRoot = app.project.rootItem.children.numItems;
    var foundFile = null;
    for (var i = 0; (numItemsAtRoot > 0) && (i < numItemsAtRoot) && (foundFile === null); i++) {
        var currentItem = app.project.rootItem.children[i];
        if ((currentItem) && currentItem.name == nameToFind) {
            foundFile = currentItem;
        }
    }
    return foundFile;
}
function findInsertedClip(track, startTime) {
    for (var _i = 0, _a = track.clips; _i < _a.length; _i++) {
        var clip = _a[_i];
        if (clip.start.seconds === startTime.seconds) {
            return clip;
        }
    }
    return null;
}
function importFile(path) {
    var file = path;
    var suppressWarnings = true;
    var importAsStills = false;
    app.project.importFiles(file, suppressWarnings, app.project.getInsertionBin(), importAsStills);
}
;
function getAdjustmentLayer() {
    var fileName = 'RSFX-container';
    var path = '/Library/Application Support/Adobe/CEP/extensions/Extract-FX/payloads/adjustment-layer.prproj';
    var foundFile = searchForFileWithName(fileName);
    if (foundFile === null) {
        message("File not found. Importing...");
        importFile(path);
        foundFile = searchForFileWithName(fileName);
        if (foundFile === null) {
            message("Failed to import the file.");
        }
        else {
            message("File imported successfully.");
        }
    }
    else {
        message("File found in the project.");
    }
    return foundFile;
}
(function copyClipEffectsToAdjustmentLayers() {
    updateEventPanel('script connected', 'info');
    var adjustmentLayer = getAdjustmentLayer();
    function findVideoTrack(index) {
        var videoTrack = app.project.activeSequence.videoTracks[index];
        return videoTrack ? videoTrack : null;
    }
    var sequence = app.project.activeSequence;
    if (!sequence) {
        alert("No active sequence found.");
        return;
    }
    var sourceTrackIndex = 1;
    var targetTrackIndex = 2;
    var sourceTrack = findVideoTrack(sourceTrackIndex - 1);
    var targetTrack = findVideoTrack(targetTrackIndex - 1);
    var qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex - 1);
    if (!sourceTrack || !targetTrack) {
        alert("Please ensure the source and target tracks exist.");
        return;
    }
    function sanitized(effect) {
        if (effect.toLowerCase() === 'motion') {
            return 'Transform';
        }
        else {
            return effect;
        }
    }
    for (var c = 0; c <= sourceTrack.clips.numItems; c++) {
        var clip = sourceTrack.clips[c];
        var clipEffects = clip.components;
        var startTime = clip.start;
        updateEventPanel("Moving effect from clip ".concat(c, " of ").concat(sourceTrack.clips.numItems, "."), 'info');
        if (clipEffects.numItems > 0) {
            var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
            if (inserted) {
                var adjustmentLyrQE = qeTargetTrack.getItemAt(c);
                var adjustmentLayer_1 = findInsertedClip(targetTrack, startTime);
                for (var _i = 0, clipEffects_1 = clipEffects; _i < clipEffects_1.length; _i++) {
                    var effect = clipEffects_1[_i];
                    var newEffect = qe.project.getVideoEffectByName(sanitized(effect.displayName));
                    var effectAdded = adjustmentLyrQE.addVideoEffect(newEffect);
                    if (effectAdded) {
                        for (var _a = 0, _b = effect.properties; _a < _b.length; _a++) {
                            var prop = _b[_a];
                            if (prop.isEffect && !prop.isReadOnly) {
                                var targetProp = newEffect.properties[sanitized(prop.displayName)];
                                if (targetProp) {
                                    targetProp.setValue(prop.getValue());
                                }
                            }
                        }
                    }
                }
                adjustmentLayer_1.end = clip.end;
            }
        }
    }
    updateEventPanel('Finished copying effects', 'info');
})();
