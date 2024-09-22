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
        if (effect.toLowerCase() === 'motion') {
            return 'Transform';
        }
        else {
            return effect;
        }
    },
    copyClipEffectsToAdjustmentLayers: function () {
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
            var sourceTrackIndex = 0;
            var targetTrackIndex = 1;
            var sourceTrack = findVideoTrack(sourceTrackIndex);
            var targetTrack = findVideoTrack(targetTrackIndex);
            var qeTargetTrack = qe.project.getActiveSequence().getVideoTrackAt(targetTrackIndex - 1);
            if (!sourceTrack || !targetTrack) {
                throw "Please ensure the source and target tracks exist.";
                return;
            }
            for (var c = 0; c <= sourceTrack.clips.numItems; c++) {
                var clip = sourceTrack.clips[c];
                var clipEffects = clip.components;
                var startTime = clip.start;
                $._PPP_.updateEventPanel("Moving effect from clip " + c + " of " + sourceTrack.clips.numItems + ".", 'info');
                if (clipEffects.numItems > 0) {
                    var inserted = targetTrack.insertClip(adjustmentLayer, startTime);
                    if (inserted) {
                        var adjustmentLyrQE = qeTargetTrack.getItemAt(c);
                        var adjustmentLayer_1 = $._PPP_.findInsertedClip(targetTrack, startTime);
                        for (var _i = 0, clipEffects_1 = clipEffects; _i < clipEffects_1.length; _i++) {
                            var effect = clipEffects_1[_i];
                            var newEffect = qe.project.getVideoEffectByName($._PPP_.sanitized(effect.displayName));
                            var effectAdded = adjustmentLyrQE.addVideoEffect(newEffect);
                            if (effectAdded) {
                                for (var _a = 0, _b = effect.properties; _a < _b.length; _a++) {
                                    var prop = _b[_a];
                                    if (prop.isEffect && !prop.isReadOnly) {
                                        var targetProp = newEffect.properties[$._PPP_.sanitized(prop.displayName)];
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
