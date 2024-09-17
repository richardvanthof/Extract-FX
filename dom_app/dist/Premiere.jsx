$._PPP_ = {
    extractFxs: function (track) {
        return track;
    },
    getVersionInfo: function () {
        return 'PPro ' + app.version + 'x' + app.build;
    },
    getUserName: function () {
        var homeDir = new File('~/');
        var userName = homeDir.displayName;
        homeDir.close();
        return userName;
    },
    keepPanelLoaded: function () {
        app.setExtensionPersistent("com.adobe.PProPanel", 0);
    },
    updateGrowingFile: function () {
        var numItems = app.project.rootItem.children.numItems;
        var currentItem = 0;
        for (var i = 0; i < numItems; i++) {
            currentItem = app.project.rootItem.children[i];
            if (currentItem) {
                currentItem.refreshMedia();
            }
        }
    },
    getSep: function () {
        if (Folder.fs == 'Macintosh') {
            return '/';
        }
        else {
            return '\\';
        }
    },
    saveProject: function () {
        app.project.save();
    },
    exportCurrentFrameAsPNG: function () {
        app.enableQE();
        var activeSequence = qe.project.getActiveSequence();
        if (activeSequence) {
            var time = activeSequence.CTI.timecode;
            var outputPath = new File("~/Desktop");
            var outputFileName = outputPath.fsName + $._PPP_.getSep() + time + '_' + activeSequence.name;
            activeSequence.exportFramePNG(time, outputFileName);
        }
        else {
            alert("No active sequence.");
        }
    },
    renameFootage: function () {
        var item = app.project.rootItem.children[0];
        if (item) {
            item.name = item.name + ", updated by PProPanel.";
        }
        else {
            alert("No project items found.");
        }
    },
    getActiveSequenceName: function () {
        if (app.project.activeSequence) {
            return app.project.activeSequence.name;
        }
        else {
            return "No active sequence.";
        }
    },
    exportSequenceAsPrProj: function () {
        var activeSequence = app.project.activeSequence;
        if (activeSequence) {
            var startTimeOffset = activeSequence.zeroPoint;
            var prProjExtension = '.prproj';
            var outputName = activeSequence.name;
            var outFolder = Folder.selectDialog();
            if (outFolder) {
                var completeOutputPath = outFolder.fsName +
                    $._PPP_.getSep() +
                    outputName +
                    prProjExtension;
                app.project.activeSequence.exportAsProject(completeOutputPath);
                alert("Exported " + app.project.activeSequence.name + " to " + completeOutputPath + ".");
            }
            else {
                alert("Could not find or create output folder.");
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    createSequenceMarkers: function () {
        var activeSequence = app.project.activeSequence;
        if (activeSequence) {
            var markers = activeSequence.markers;
            if (markers) {
                var numMarkers = markers.numMarkers;
                if (numMarkers > 0) {
                    var marker_index = 1;
                    for (var current_marker = markers.getFirstMarker(); current_marker !== undefined; current_marker = markers.getNextMarker(current_marker)) {
                        if (current_marker.name !== "") {
                            alert('Marker ' + marker_index + ' name = ' + current_marker.name + '.');
                        }
                        else {
                            alert('Marker ' + marker_index + ' has no name.');
                        }
                        if (current_marker.end.seconds > 0) {
                            alert('Marker ' + marker_index + ' duration = ' + (current_marker.end.seconds - current_marker.start.seconds) + ' seconds.');
                        }
                        else {
                            alert('Marker ' + marker_index + ' has no duration.');
                        }
                        alert('Marker ' + marker_index + ' starts at ' + current_marker.start.seconds + ' seconds.');
                        marker_index = marker_index + 1;
                    }
                }
            }
            var newCommentMarker = markers.createMarker(12.345);
            newCommentMarker.name = 'Marker created by PProPanel.';
            newCommentMarker.comments = 'Here are some comments, inserted by PProPanel.';
            newCommentMarker.end = 15.6789;
            var newWebMarker = markers.createMarker(14.345);
            newWebMarker.name = 'Web marker created by PProPanel.';
            newWebMarker.comments = 'Here are some comments, inserted by PProPanel.';
            newWebMarker.end = 17.6789;
            newWebMarker.setTypeAsWebLink("http://www.adobe.com", "frame target");
        }
        else {
            alert("No active sequence.");
        }
    },
    exportFCPXML: function () {
        if (app.project.activeSequence) {
            var projPath = new File(app.project.path);
            var parentDir = projPath.parent;
            var outputName = app.project.activeSequence.name;
            var xmlExtension = '.xml';
            var outputPath = Folder.selectDialog("Choose the output directory");
            if (outputPath) {
                var completeOutputPath = outputPath.fsName + $._PPP_.getSep() + outputName + xmlExtension;
                app.project.activeSequence.exportAsFinalCutProXML(completeOutputPath, 1);
                var info = "Exported FCP XML for " +
                    app.project.activeSequence.name +
                    " to " +
                    completeOutputPath +
                    ".";
                alert(info);
            }
            else {
                alert("No output path chosen.");
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    openInSource: function () {
        app.enableQE();
        var fileToOpen = File.openDialog("Choose file to open.", 0, false);
        if (fileToOpen) {
            qe.source.openFilePath(fileToOpen.fsName);
            qe.source.player.play();
            fileToOpen.close();
        }
    },
    searchForBinWithName: function (nameToFind) {
        var numItemsAtRoot = app.project.rootItem.children.numItems;
        var foundBin = 0;
        for (var i = 0; (numItemsAtRoot > 0) && (i < numItemsAtRoot) && (foundBin === 0); i++) {
            var currentItem = app.project.rootItem.children[i];
            if ((currentItem) && currentItem.name == nameToFind) {
                foundBin = currentItem;
            }
        }
        return foundBin;
    },
    importFiles: function () {
        if (app.project) {
            var fileOrFilesToImport = File.openDialog("Choose files to import", 0, true);
            var currentTargetBin = app.project.getInsertionBin();
            if (currentTargetBin.nodeId === app.project.rootItem.nodeId) {
            }
            if (fileOrFilesToImport) {
                var nameToFind = 'Targeted by PProPanel import';
                var targetBin = $._PPP_.searchForBinWithName(nameToFind);
                if (targetBin === 0) {
                    app.project.rootItem.createBin(nameToFind);
                    targetBin = $._PPP_.searchForBinWithName(nameToFind);
                }
                if (targetBin) {
                    targetBin.select();
                    var importThese = new Array();
                    if (importThese) {
                        for (var i = 0; i < fileOrFilesToImport.length; i++) {
                            importThese[i] = fileOrFilesToImport[i].fsName;
                        }
                        app.project.importFiles(importThese, 1, targetBin, 0);
                    }
                }
                else {
                    alert("Could not find or create target bin.");
                }
            }
        }
    },
    muteFun: function () {
        if (app.project.activeSequence) {
            for (var i = 0; i < app.project.activeSequence.audioTracks.numTracks; i++) {
                var currentTrack = app.project.activeSequence.audioTracks[i];
                if (Math.random() > 0.5) {
                    currentTrack.setMute(!(currentTrack.isMuted()));
                }
            }
        }
        else {
            alert("No active sequence found.");
        }
    },
    disableImportWorkspaceWithProjects: function () {
        var prefToModify = 'FE.Prefs.ImportWorkspace';
        var appProperties = app.properties;
        if (appProperties) {
            var propertyExists = app.properties.doesPropertyExist(prefToModify);
            var propertyIsReadOnly = app.properties.isPropertyReadOnly(prefToModify);
            var propertyValue = app.properties.getProperty(prefToModify);
            appProperties.setProperty(prefToModify, false, 1);
            var safetyCheck = app.properties.getProperty(prefToModify);
            if (safetyCheck != propertyValue) {
                alert("Changed \'Import Workspaces with Projects\' from " + propertyValue + " to " + safetyCheck + ".");
            }
        }
        else {
            alert("Properties not found.");
        }
    },
    replaceMedia: function () {
        var firstProjectItem = app.project.rootItem.children[0];
        if (firstProjectItem) {
            if (firstProjectItem.canChangeMediaPath()) {
                firstProjectItem.setScaleToFrameSize();
                var replacementMedia = File.openDialog("Choose new media file, for " +
                    firstProjectItem.name, 0, false);
                if (replacementMedia) {
                    firstProjectItem.name = replacementMedia.name + ", formerly known as " + firstProjectItem.name;
                    firstProjectItem.changeMediaPath(replacementMedia.fsName);
                    replacementMedia.close();
                }
            }
            else {
                alert("Couldn't change path of " + firstProjectItem.name + ".");
            }
        }
        else {
            alert("No project items found.");
        }
    },
    openProject: function () {
        var filterString = "";
        if (Folder.fs === 'Windows') {
            filterString = "All files:*.*";
        }
        var projToOpen = File.openDialog("Choose project:", filterString, false);
        if ((projToOpen) && projToOpen.exists) {
            app.openDocument(projToOpen.fsName, 1, 1, 1);
            projToOpen.close();
        }
    },
    exportFramesForMarkers: function () {
        app.enableQE();
        var activeSequence = app.project.activeSequence;
        if (activeSequence) {
            var markers = activeSequence.markers;
            var markerCount = markers.numMarkers;
            if (markerCount > 0) {
                var firstMarker = markers.getFirstMarker();
                activeSequence.setPlayerPosition(firstMarker.start.ticks);
                $._PPP_.exportCurrentFrameAsPNG();
                var previousMarker = 0;
                if (firstMarker) {
                    for (var i = 0; i < markerCount; i++) {
                        if (i === 0) {
                            currentMarker = markers.getNextMarker(firstMarker);
                        }
                        else {
                            currentMarker = markers.getNextMarker(previousMarker);
                        }
                        if (currentMarker) {
                            activeSequence.setPlayerPosition(currentMarker.start.ticks);
                            previousMarker = currentMarker;
                            $._PPP_.exportCurrentFrameAsPNG();
                        }
                    }
                }
            }
            else {
                alert("No markers applied to " + activeSequence.name + ".");
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    createSequence: function (name) {
        var someID = "xyz123";
        var seqName = prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
        app.project.createNewSequence(seqName, someID);
    },
    createSequenceFromPreset: function (presetPath) {
        app.enableQE();
        var seqName = prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
        if (seqName) {
            qe.project.newSequence(seqName, presetPath);
        }
    },
    transcode: function (outputPresetPath) {
        app.encoder.bind('onEncoderJobComplete', $._PPP_.onEncoderJobComplete);
        app.encoder.bind('onEncoderJobError', $._PPP_.onEncoderJobError);
        app.encoder.bind('onEncoderJobProgress', $._PPP_.onEncoderJobProgress);
        app.encoder.bind('onEncoderJobQueued', $._PPP_.onEncoderJobQueued);
        app.encoder.bind('onEncoderJobCanceled', $._PPP_.onEncoderJobCanceled);
        var firstProjectItem = app.project.rootItem.children[0];
        if (firstProjectItem) {
            app.encoder.launchEncoder();
            var fileOutputPath = Folder.selectDialog("Choose the output directory");
            if (fileOutputPath) {
                var outputName = firstProjectItem.name.search('[.]');
                if (outputName == -1) {
                    outputName = firstProjectItem.name.length;
                }
                outFileName = firstProjectItem.name.substr(0, outputName);
                outFileName = outFileName.replace('/', '-');
                var completeOutputPath = fileOutputPath.fsName + $._PPP_.getSep() + outFileName + '.mxf';
                var removeFromQueue = false;
                var rangeToEncode = app.encoder.ENCODE_IN_TO_OUT;
                app.encoder.encodeProjectItem(firstProjectItem, completeOutputPath, outputPresetPath, rangeToEncode, removeFromQueue);
                app.encoder.startBatch();
            }
        }
        else {
            alert("No project items found.");
        }
    },
    transcodeExternal: function (outputPresetPath) {
        app.encoder.launchEncoder();
        var fileToTranscode = File.openDialog("Choose file to open.", 0, false);
        if (fileToTranscode) {
            var fileOutputPath = Folder.selectDialog("Choose the output directory");
            if (fileOutputPath) {
                var srcInPoint = 1.0;
                var srcOutPoint = 3.0;
                var removeFromQueue = false;
                var result = app.encoder.encodeFile(fileToTranscode.fsName, fileOutputPath.fsName, outputPresetPath, removeFromQueue, srcInPoint, srcOutPoint);
            }
        }
    },
    render: function (outputPresetPath) {
        app.enableQE();
        var activeSequence = qe.project.getActiveSequence();
        if (activeSequence) {
            app.encoder.launchEncoder();
            var timeSecs = activeSequence.CTI.secs;
            var timeFrames = activeSequence.CTI.frames;
            var timeTicks = activeSequence.CTI.ticks;
            var timeString = activeSequence.CTI.timecode;
            var seqInPoint = app.project.activeSequence.getInPoint();
            var seqOutPoint = app.project.activeSequence.getOutPoint();
            var projPath = new File(app.project.path);
            var outputPath = Folder.selectDialog("Choose the output directory");
            if ((outputPath) && projPath.exists) {
                var outPreset = new File(outputPresetPath);
                if (outPreset.exists === true) {
                    var outputFormatExtension = activeSequence.getExportFileExtension(outPreset.fsName);
                    if (outputFormatExtension) {
                        var outputFilename = activeSequence.name + '.' + outputFormatExtension;
                        var fullPathToFile = outputPath.fsName +
                            $._PPP_.getSep() +
                            activeSequence.name +
                            "." +
                            outputFormatExtension;
                        var outFileTest = new File(fullPathToFile);
                        if (outFileTest.exists) {
                            var destroyExisting = confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
                            if (destroyExisting) {
                                outFileTest.remove();
                                outFileTest.close();
                            }
                        }
                        app.encoder.bind('onEncoderJobComplete', $._PPP_.onEncoderJobComplete);
                        app.encoder.bind('onEncoderJobError', $._PPP_.onEncoderJobError);
                        app.encoder.bind('onEncoderJobProgress', $._PPP_.onEncoderJobProgress);
                        app.encoder.bind('onEncoderJobQueued', $._PPP_.onEncoderJobQueued);
                        app.encoder.bind('onEncoderJobCanceled', $._PPP_.onEncoderJobCanceled);
                        app.encoder.setSidecarXMPEnabled(0);
                        app.encoder.setEmbeddedXMPEnabled(0);
                        var jobID = app.encoder.encodeSequence(app.project.activeSequence, fullPathToFile, outPreset.fsName, app.encoder.ENCODE_WORKAREA, 1);
                        $._PPP_.message('jobID = ' + jobID);
                        outPreset.close();
                    }
                }
                else {
                    alert("Could not find output preset.");
                }
            }
            else {
                alert("Could not find/create output path.");
            }
            projPath.close();
        }
        else {
            alert("No active sequence.");
        }
    },
    saveProjectAs: function () {
        var sessionCounter = 1;
        var outputPath = Folder.selectDialog("Choose the output directory");
        if (outputPath) {
            var absPath = outputPath.fsName;
            var outputName = String(app.project.name);
            var array = outputName.split('.', 2);
            outputName = array[0] + sessionCounter + '.' + array[1];
            sessionCounter++;
            var fullOutPath = absPath + $._PPP_.getSep() + outputName;
            app.project.saveAs(fullOutPath);
            app.openDocument(fullOutPath, 1, 1, 1);
        }
    },
    mungeXMP: function () {
        var projectItem = app.project.rootItem.children[0];
        if (projectItem) {
            if (ExternalObject.AdobeXMPScript === undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
            }
            if (ExternalObject.AdobeXMPScript !== undefined) {
                var xmpBlob = projectItem.getXMPMetadata();
                var xmp = new XMPMeta(xmpBlob);
                var oldFrameRateVal = "";
                var oldDMCreatorVal = "";
                if (xmp.doesPropertyExist(XMPConst.NS_DM, "framerate") === true) {
                    var myFrameRate = xmp.getProperty(XMPConst.NS_DM, "scene");
                    oldFrameRateVal = myFrameRate.value;
                }
                if (xmp.doesPropertyExist(XMPConst.NS_DM, "creator") === true) {
                    var myFrameRate = xmp.getProperty(XMPConst.NS_DM, "creator");
                    oldFrameRateVal = myFrameRate.value;
                }
                xmp.setProperty(XMPConst.NS_DM, "scene", oldFrameRateVal + " Added by PProPanel sample!");
                xmp.setProperty(XMPConst.NS_DM, "creator", oldDMCreatorVal + " Added by PProPanel sample!");
                var creatorProp = "creator";
                var containsDMCreatorValue = xmp.doesPropertyExist(XMPConst.NS_DC, creatorProp);
                var numCreatorValuesPresent = xmp.countArrayItems(XMPConst.NS_DC, creatorProp);
                var CreatorsSeparatedBy4PoundSigns = "";
                if (numCreatorValuesPresent > 0) {
                    for (var z = 0; z < numCreatorValuesPresent; z++) {
                        CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + xmp.getArrayItem(XMPConst.NS_DC, creatorProp, z + 1);
                        CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + "####";
                    }
                    alert(CreatorsSeparatedBy4PoundSigns);
                    if (confirm("Replace previous?", false, "Replace existing Creator?")) {
                        xmp.deleteProperty(XMPConst.NS_DC, "creator");
                    }
                    xmp.appendArrayItem(XMPConst.NS_DC, creatorProp, numCreatorValuesPresent + " creator values were already present.", null, XMPConst.ARRAY_IS_ORDERED);
                }
                else {
                    xmp.appendArrayItem(XMPConst.NS_DC, creatorProp, "PProPanel wrote the first value into NS_DC creator field.", null, XMPConst.ARRAY_IS_ORDERED);
                }
                var xmpAsString = xmp.serialize();
                projectItem.setXMPMetadata(xmpAsString);
            }
        }
        else {
            alert("Project item required.");
        }
    },
    getProductionByName: function (nameToGet) {
        for (var i = 0; i < productionList.numProductions; i++) {
            this_prod = productionList[i];
            if (this_prod.name == nameToGet) {
                return this_prod;
            }
        }
        return undefined;
    },
    pokeAnywhere: function () {
        var token = app.anywhere.getAuthenticationToken();
        var productionList = app.anywhere.listProductions();
        var isProductionOpen = app.anywhere.isProductionOpen();
        if (isProductionOpen === true) {
            var sessionURL = app.anywhere.getCurrentEditingSessionURL();
            var selectionURL = app.anywhere.getCurrentEditingSessionSelectionURL();
            var activeSequenceURL = app.anywhere.getCurrentEditingSessionActiveSequenceURL();
            var theOneIAskedFor = $._PPP_.getProductionByName("test");
            if (theOneIAskedFor) {
                var out = theOneIAskedFor.name + ", " + theOneIAskedFor.description;
                alert("Found: " + out);
            }
        }
        else {
            alert("No Production open.");
        }
    },
    dumpOMF: function () {
        var activeSequence = app.project.activeSequence;
        if (activeSequence) {
            var outputPath = Folder.selectDialog("Choose the output directory");
            if (outputPath) {
                var absPath = outputPath.fsName;
                var outputName = String(activeSequence.name) + '.omf';
                var fullOutPathWithName = absPath + $._PPP_.getSep() + outputName;
                app.project.exportOMF(app.project.activeSequence, fullOutPathWithName, 'OMFTitle', 48000, 16, 1, 0, 0, 0, 0);
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    addClipMarkers: function () {
        if (app.project.rootItem.children.numItems > 0) {
            var projectItem = app.project.rootItem.children[0];
            if (projectItem) {
                if (projectItem.type == ProjectItemType.CLIP ||
                    projectItem.type == ProjectItemType.FILE) {
                    markers = projectItem.getMarkers();
                    if (markers) {
                        var num_markers = markers.numMarkers;
                        var new_marker = markers.createMarker(12.345);
                        var guid = new_marker.guid;
                        new_marker.name = 'Marker created by PProPanel.';
                        new_marker.comments = 'Here are some comments, inserted by PProPanel.';
                        new_marker.end = 15.6789;
                    }
                }
                else {
                    alert("Can only add markers to footage items.");
                }
            }
            else {
                alert("Could not find first projectItem.");
            }
        }
        else {
            alert("Project is empty.");
        }
    },
    modifyProjectMetadata: function () {
        var kPProPrivateProjectMetadataURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
        var namefield = "Column.Intrinsic.Name";
        var tapename = "Column.Intrinsic.TapeName";
        var desc = "Column.PropertyText.Description";
        var logNote = "Column.Intrinsic.LogNote";
        var newField = "ExampleFieldName";
        if (app.isDocumentOpen()) {
            var projectItem = app.project.rootItem.children[0];
            if (projectItem) {
                if (ExternalObject.AdobeXMPScript === undefined) {
                    ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
                }
                if (ExternalObject.AdobeXMPScript !== undefined) {
                    var projectMetadata = projectItem.getProjectMetadata();
                    var successfullyAdded = app.project.addPropertyToProjectMetadataSchema(newField, "ExampleFieldLabel", 2);
                    var xmp = new XMPMeta(projectMetadata);
                    var obj = xmp.dumpObject();
                    var namespaces = XMPMeta.dumpNamespaces();
                    var found_name = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, namefield);
                    var found_tapename = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, tapename);
                    var found_desc = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, desc);
                    var found_custom = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);
                    var foundLogNote = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, logNote);
                    var oldLogValue = "";
                    var appendThis = "This log note inserted by PProPanel.";
                    var appendTextWasActuallyNew = false;
                    if (foundLogNote) {
                        var oldLogNote = xmp.getProperty(kPProPrivateProjectMetadataURI, logNote);
                        if (oldLogNote) {
                            oldLogValue = oldLogNote.value;
                        }
                    }
                    xmp.setProperty(kPProPrivateProjectMetadataURI, tapename, "***TAPENAME***");
                    xmp.setProperty(kPProPrivateProjectMetadataURI, desc, "***DESCRIPTION***");
                    xmp.setProperty(kPProPrivateProjectMetadataURI, namefield, "***NEWNAME***");
                    xmp.setProperty(kPProPrivateProjectMetadataURI, newField, "PProPanel set this, using addPropertyToProjectMetadataSchema().");
                    var array = new Array();
                    array[0] = tapename;
                    array[1] = desc;
                    array[2] = namefield;
                    array[3] = newField;
                    var concatenatedLogNotes = "";
                    if (oldLogValue != appendThis) {
                        if (oldLogValue.length > 0) {
                            concatenatedLogNotes += "Previous log notes: " + oldLogValue + "    ||||    ";
                        }
                        concatenatedLogNotes += appendThis;
                        xmp.setProperty(kPProPrivateProjectMetadataURI, logNote, concatenatedLogNotes);
                        array[4] = logNote;
                    }
                    var str = xmp.serialize();
                    projectItem.setProjectMetadata(str, array);
                    var newblob = projectItem.getProjectMetadata();
                    var newXMP = new XMPMeta(newblob);
                    var foundYet = newXMP.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);
                    if (foundYet) {
                        alert("PProPanel successfully added a field to the project metadata schema, and set a value for it.");
                    }
                }
            }
            else {
                alert("No project items found.");
            }
        }
    },
    updatePAR: function () {
        var item = app.project.rootItem.children[0];
        if (item) {
            if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)) {
                item.setOverridePixelAspectRatio(185, 100);
            }
            else {
                alert('You cannot override the PAR of bins or sequences.');
            }
        }
        else {
            alert("No project items found.");
        }
    },
    getnumAEProjectItems: function () {
        var bt = new BridgeTalk();
        bt.target = 'aftereffects';
        bt.body = 'alert("Items in AE project: " + app.project.rootFolder.numItems);app.quit();';
        bt.send();
    },
    updateEventPanel: function () {
        app.setSDKEventMessage('Here is some information.', 'info');
        app.setSDKEventMessage('Here is a warning.', 'warning');
    },
    walkAllBinsForFootage: function (parentItem, outPath) {
        for (var j = 0; j < parentItem.children.numItems; j++) {
            var currentChild = parentItem.children[j];
            if (currentChild) {
                if (currentChild.type == ProjectItemType.BIN) {
                    $._PPP_.walkAllBinsForFootage(currentChild, outPath);
                }
                else {
                    $._PPP_.dumpProjectItemXMP(currentChild, outPath);
                }
            }
        }
    },
    searchBinForProjItemByName: function (i, currentItem, nameToFind) {
        for (var j = i; j < currentItem.children.numItems; j++) {
            var currentChild = currentItem.children[j];
            if (currentChild) {
                if (currentChild.type == ProjectItemType.BIN) {
                    return $._PPP_.searchBinForProjItemByName(j, currentChild, nameToFind);
                }
                else {
                    if (currentChild.name == nameToFind) {
                        return currentChild;
                    }
                    else {
                        currentChild = currentItem.children[j + 1];
                        if (currentChild) {
                            return $._PPP_.searchBinForProjItemByName(0, currentChild, nameToFind);
                        }
                    }
                }
            }
        }
    },
    dumpXMPFromSequences: function () {
        var outPath = Folder.selectDialog("Choose the output directory");
        var projForSeq = 0;
        var seqCount = app.project.sequences.numSequences;
        for (var i = 0; i < seqCount; i++) {
            var currentSeq = app.project.sequences[i];
            if (currentSeq) {
                projForSeq = $._PPP_.searchBinForProjItemByName(0, app.project.rootItem, currentSeq.name);
                if (projForSeq) {
                    $._PPP_.dumpProjectItemXMP(projForSeq, outPath.fsName);
                }
                else {
                    alert("Couldn't find projectItem for sequence " + currentSeq.name);
                }
            }
        }
    },
    dumpProjectItemXMP: function (projectItem, outPath) {
        var xmpBlob = projectItem.getXMPMetadata();
        var outFileName = projectItem.name + '.xmp';
        var completeOutputPath = outPath + $._PPP_.getSep() + outFileName;
        var outFile = new File(completeOutputPath);
        if (outFile) {
            outFile.encoding = "UTF8";
            outFile.open("w", "TEXT", "????");
            outFile.write(xmpBlob.toString());
            outFile.close();
        }
    },
    addSubClip: function () {
        var startTimeSeconds = 1.23743;
        var endTimeSeconds = 3.5235;
        var hasHardBoundaries = 0;
        var sessionCounter = 1;
        var takeVideo = 1;
        var takeAudio = 1;
        var projectItem = app.project.rootItem.children[0];
        if (projectItem) {
            if ((projectItem.type == ProjectItemType.CLIP) || (projectItem.type == ProjectItemType.FILE)) {
                var newSubClipName = prompt('Name of subclip?', projectItem.name + '_' + sessionCounter, 'Name your subclip');
                var newSubClip = projectItem.createSubClip(newSubClipName, startTimeSeconds, endTimeSeconds, hasHardBoundaries, takeVideo, takeAudio);
                if (newSubClip) {
                    newSubClip.setStartTime(12.345);
                }
            }
            else {
                alert("Could not sub-clip " + projectItem.name + ".");
            }
        }
        else {
            alert("No project item found.");
        }
    },
    dumpXMPFromAllProjectItems: function () {
        var numItemsInRoot = app.project.rootItem.children.numItems;
        if (numItemsInRoot > 0) {
            var outPath = Folder.selectDialog("Choose the output directory");
            if (outPath) {
                for (var i = 0; i < numItemsInRoot; i++) {
                    var currentItem = app.project.rootItem.children[i];
                    if (currentItem) {
                        if (currentItem.type == ProjectItemType.BIN) {
                            $._PPP_.walkAllBinsForFootage(currentItem, outPath.fsName);
                        }
                        else {
                            $._PPP_.dumpProjectItemXMP(currentItem, outPath.fsName);
                        }
                    }
                }
            }
        }
        else {
            alert("No project items found.");
        }
    },
    exportAAF: function () {
        var sessionCounter = 1;
        if (app.project.activeSequence) {
            var outputPath = Folder.selectDialog("Choose the output directory");
            if (outputPath) {
                var absPath = outputPath.fsName;
                var outputName = String(app.project.name);
                var array = outputName.split('.', 2);
                outputName = array[0] + sessionCounter + '.' + array[1];
                sessionCounter++;
                var fullOutPath = absPath + $._PPP_.getSep() + outputName + '.aaf';
                app.project.exportAAF(app.project.activeSequence, fullOutPath, 1, 0, 96000, 16, 0, 0, 0, 0);
            }
            else {
                alert("Couldn't create AAF output.");
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    setScratchDisk: function () {
        var scratchPath = Folder.selectDialog("Choose new scratch disk directory");
        if ((scratchPath) && scratchPath.exists) {
            app.setScratchDiskPath(scratchPath.fsName, ScratchDiskType.FirstAutoSaveFolder);
        }
    },
    getSequenceProxySetting: function () {
        var returnVal = 'No sequence detected.';
        var seq = app.project.activeSequence;
        if (seq) {
            if (seq.getEnableProxies() > 0) {
                returnVal = 'true';
            }
            else {
                returnVal = 'false';
            }
        }
        else {
            alert("No active sequence.");
        }
        return returnVal;
    },
    toggleProxyState: function () {
        var seq = app.project.activeSequence;
        if (seq) {
            var update = "Proxies for " + seq.name + " turned ";
            if (seq.getEnableProxies() > 0) {
                seq.setEnableProxies(false);
                update = update + "OFF.";
                app.setSDKEventMessage(update, 'info');
            }
            else {
                seq.setEnableProxies(true);
                update = update + "ON.";
                app.setSDKEventMessage(update, 'info');
            }
        }
        else {
            alert("No active sequence.");
        }
    },
    setProxiesON: function () {
        var firstProjectItem = app.project.rootItem.children[0];
        if (firstProjectItem) {
            if (firstProjectItem.canProxy()) {
                var shouldAttachProxy = true;
                if (firstProjectItem.hasProxy()) {
                    shouldAttachProxy = confirm(firstProjectItem.name + " already has an assigned proxy. Re-assign anyway?", false, "Are you sure...?");
                }
                if (shouldAttachProxy) {
                    var proxyPath = File.openDialog("Choose proxy for " + firstProjectItem.name + ":");
                    if (proxyPath.exists) {
                        firstProjectItem.attachProxy(proxyPath.fsName, 0);
                    }
                    else {
                        alert("Could not attach proxy from " + proxyPath + ".");
                    }
                }
            }
            else {
                alert("Cannot attach a proxy to " + firstProjectItem.name + ".");
            }
        }
        else {
            alert("No project item available.");
        }
    },
    clearCache: function () {
        app.enableQE();
        MediaType = {};
        MediaType.VIDEO = "228CDA18-3625-4d2d-951E-348879E4ED93";
        MediaType.AUDIO = "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009";
        MediaType.ANY = "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
        qe.project.deletePreviewFiles(MediaType.ANY);
        alert("All video and audio preview files deleted.");
    },
    randomizeSequenceSelection: function () {
        var sequence = app.project.activeSequence;
        if (sequence) {
            var trackGroups = [sequence.audioTracks, sequence.videoTracks];
            var trackGroupNames = ["audioTracks", "videoTracks"];
            var updateUI = true;
            for (var gi = 0; gi < 2; gi++) {
                $._PPP_.message(trackGroupNames[gi]);
                group = trackGroups[gi];
                for (var ti = 0; ti < group.numTracks; ti++) {
                    var track = group[ti];
                    var clips = track.clips;
                    var transitions = track.transitions;
                    $._PPP_.message("track : " + ti + "	 clip count: " + clips.numTracks + "	  transition count: " + transitions.numTracks);
                    for (var ci = 0; ci < clips.numTracks; ci++) {
                        var clip = clips[ci];
                        name = (clip.projectItem == undefined ? "<null>" : clip.projectItem.name);
                        var before = clip.isSelected();
                        clip.setSelected((Math.random() > 0.5), updateUI);
                        var beforeSelected = before ? "Y" : "N";
                        var afterSelected = clip.selected ? "Y" : "N";
                        $._PPP_.message("clip : " + ci + "	 " + name + "		" + beforeSelected + " -> " + afterSelected);
                    }
                    for (var tni = 0; tni < transitions.numTracks; ++tni) {
                        var transition = transitions[tni];
                        var before = transition.isSelected();
                        transition.setSelected((Math.random() > 0.5), updateUI);
                        var beforeSelected = before ? "Y" : "N";
                        var afterSelected = transition.selected ? "Y" : "N";
                        $._PPP_.message('transition: ' + tni + "		" + beforeSelected + " -> " + afterSelected);
                    }
                }
            }
        }
        else {
            alert("No active sequence found.");
        }
    },
    message: function (msg) {
        $.writeln(msg);
    },
    onEncoderJobComplete: function (jobID, outputFilePath) {
        var eoName;
        if (Folder.fs == 'Macintosh') {
            eoName = "PlugPlugExternalObject";
        }
        else {
            eoName = "PlugPlugExternalObject.dll";
        }
        var suffixAddedByPPro = '_1';
        var withoutExtension = outputFilePath.slice(0, -4);
        var lastIndex = outputFilePath.lastIndexOf(".");
        var extension = outputFilePath.substr(lastIndex + 1);
        if (outputFilePath.indexOf(suffixAddedByPPro)) {
            alert(" Output filename was changed: the output preset name may have been added, or there may have been an existing file with that name. This would be a good place to deal with such occurrences.");
        }
        var mylib = new ExternalObject('lib:' + eoName);
        var eventObj = new CSXSEvent();
        eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
        eventObj.data = "Rendered Job " + jobID + ", to " + outputFilePath + ".";
        eventObj.dispatch();
    },
    onEncoderJobError: function (jobID, errorMessage) {
        var eoName;
        if (Folder.fs === 'Macintosh') {
            eoName = "PlugPlugExternalObject";
        }
        else {
            eoName = "PlugPlugExternalObject.dll";
        }
        var mylib = new ExternalObject('lib:' + eoName);
        var eventObj = new CSXSEvent();
        eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
        eventObj.data = "Job " + jobID + " failed, due to " + errorMessage + ".";
        eventObj.dispatch();
    },
    onEncoderJobProgress: function (jobID, progress) {
        $._PPP_.message('onEncoderJobProgress called. jobID = ' + jobID + '. progress = ' + progress + '.');
    },
    onEncoderJobQueued: function (jobID) {
        app.encoder.startBatch();
    },
    onEncoderJobCanceled: function (jobID) {
        $._PPP_.message('OnEncoderJobCanceled called. jobID = ' + jobID + '.');
    },
    onPlayWithKeyframes: function () {
        var seq = app.project.activeSequence;
        if (seq) {
            var firstVideoTrack = seq.videoTracks[0];
            if (firstVideoTrack) {
                var firstClip = firstVideoTrack.clips[0];
                if (firstClip) {
                    var clipComponents = firstClip.components;
                    if (clipComponents) {
                        for (var i = 0; i < clipComponents.numItems; ++i) {
                            $._PPP_.message('component ' + i + ' = ' + clipComponents[i].matchName + ' : ' + clipComponents[i].displayName);
                        }
                        if (clipComponents.numItems > 2) {
                            var blur = clipComponents[2];
                            if (blur) {
                                var blurProps = blur.properties;
                                if (blurProps) {
                                    for (var j = 0; j < blurProps.numItems; ++j) {
                                        $._PPP_.message('param ' + j + ' = ' + blurProps[j].displayName);
                                    }
                                    var blurriness = blurProps[0];
                                    if (blurriness) {
                                        if (!blurriness.isTimeVarying()) {
                                            blurriness.setTimeVarying(true);
                                        }
                                        for (var k = 0; k < 20; ++k) {
                                            updateUI = (k == 9);
                                            blurriness.addKey(k);
                                            var blurVal = Math.sin(3.14159 * i / 5) * 20 + 25;
                                            blurriness.setValueAtKey(k, blurVal, updateUI);
                                        }
                                    }
                                    var repeatEdgePixels = blurProps[2];
                                    if (repeatEdgePixels) {
                                        if (!repeatEdgePixels.getValue()) {
                                            updateUI = true;
                                            repeatEdgePixels.setValue(true, updateUI);
                                        }
                                    }
                                    var keyFrameTime = blurriness.findNearestKey(4.0, 0.1);
                                    if (keyFrameTime != undefined) {
                                        $._PPP_.message('Found keyframe = ' + keyFrameTime.seconds);
                                    }
                                    else {
                                        $._PPP_.message('Keyframe not found.');
                                    }
                                    keyFrameTime = blurriness.findNearestKey(0.0, 0.1);
                                    var lastKeyFrameTime = keyFrameTime;
                                    while (keyFrameTime != undefined) {
                                        $._PPP_.message('keyframe @ ' + keyFrameTime.seconds);
                                        lastKeyFrameTime = keyFrameTime;
                                        keyFrameTime = blurriness.findNextKey(keyFrameTime);
                                    }
                                    keyFrameTime = lastKeyFrameTime;
                                    while (keyFrameTime != undefined) {
                                        $._PPP_.message('keyframe @ ' + keyFrameTime.seconds);
                                        lastKeyFrameTime = keyFrameTime;
                                        keyFrameTime = blurriness.findPreviousKey(keyFrameTime);
                                    }
                                    var blurKeyframesArray = blurriness.getKeys();
                                    if (blurKeyframesArray) {
                                        $._PPP_.message(blurKeyframesArray.length + ' keyframes found');
                                    }
                                    blurriness.removeKey(19);
                                    var shouldUpdateUI = true;
                                    blurriness.removeKeyRange(0, 5, shouldUpdateUI);
                                }
                            }
                            else {
                                alert("Please apply the Gaussian Blur effect to the first clip in the first video track of the active sequence.");
                            }
                        }
                    }
                }
            }
        }
        else {
            alert("No active sequence found.");
        }
    },
    extractFileNameFromPath: function (fullPath) {
        var lastDot = fullPath.lastIndexOf(".");
        var lastSep = fullPath.lastIndexOf("/");
        if (lastDot > -1) {
            return fullPath.substr((lastSep + 1), (fullPath.length - (lastDot + 1)));
        }
        else {
            return fullPath;
        }
    },
    onProxyTranscodeJobComplete: function (jobID, outputFilePath) {
        var suffixAddedByPPro = '_1';
        var withoutExtension = outputFilePath.slice(0, -4);
        var lastIndex = outputFilePath.lastIndexOf(".");
        var extension = outputFilePath.substr(lastIndex + 1);
        var wrapper = new Array();
        wrapper[0] = outputFilePath;
        var nameToFind = 'Proxies generated by PProPanel';
        var targetBin = $._PPP_.searchForBinWithName(nameToFind);
        if (targetBin === 0) {
            app.project.rootItem.createBin(nameToFind);
            targetBin = $._PPP_.searchForBinWithName(nameToFind);
        }
        if (targetBin) {
            targetBin.select();
            app.project.importFiles(wrapper);
        }
    },
    onProxyTranscodeJobError: function (jobID, errorMessage) {
        alert(errorMessage);
    },
    onProxyTranscodeJobQueued: function (jobID) {
        app.encoder.startBatch();
    },
    ingestFiles: function (outputPresetPath) {
        app.encoder.bind('onEncoderJobComplete', $._PPP_.onProxyTranscodeJobComplete);
        app.encoder.bind('onEncoderJobError', $._PPP_.onProxyTranscodeJobError);
        app.encoder.bind('onEncoderJobQueued', $._PPP_.onProxyTranscodeJobQueued);
        app.encoder.bind('onEncoderJobCanceled', $._PPP_.onEncoderJobCanceled);
        if (app.project) {
            var fileOrFilesToImport = File.openDialog("Choose full resolution files to import", 0, true);
            if (fileOrFilesToImport) {
                var nameToFind = 'Proxies generated by PProPanel';
                var targetBin = $._PPP_.searchForBinWithName(nameToFind);
                if (targetBin === 0) {
                    app.project.rootItem.createBin(nameToFind);
                    targetBin = $._PPP_.searchForBinWithName(nameToFind);
                }
                if (targetBin) {
                    targetBin.select();
                    var importThese = new Array();
                    if (importThese) {
                        for (var i = 0; i < fileOrFilesToImport.length; i++) {
                            importThese[i] = fileOrFilesToImport[i].fsName;
                            var justFileName = extractFileNameFromPath(importThese[i]);
                            var suffix = '_PROXY.mp4';
                            var containingPath = fileOrFilesToImport[i].parent.fsName;
                            var completeProxyPath = containingPath + $._PPP_.getSep() + justFileName + suffix;
                            var jobID = app.encoder.encodeFile(fileOrFilesToImport[i].fsName, completeProxyPath, outputPresetPath, 0);
                        }
                        app.project.importFiles(importThese, 1, targetBin, 0);
                    }
                }
            }
        }
    },
    insertOrAppend: function () {
        var seq = app.project.activeSequence;
        if (seq) {
            var first = app.project.rootItem.children[0];
            if (first) {
                var vTrack1 = seq.videoTracks[0];
                if (vTrack1) {
                    if (vTrack1.clips.numItems > 0) {
                        var lastClip = vTrack1.clips[(vTrack1.clips.numItems - 1)];
                        if (lastClip) {
                            vTrack1.insertClip(first, lastClip.end.seconds);
                        }
                    }
                    else {
                        vTrack1.insertClip(first, '00;00;00;00');
                    }
                }
                else {
                    alert("Could not find first video track.");
                }
            }
            else {
                alert("Couldn't locate first projectItem.");
            }
        }
        else {
            alert("No active sequence found.");
        }
    },
    overWrite: function () {
        var seq = app.project.activeSequence;
        if (seq) {
            var first = app.project.rootItem.children[0];
            if (first) {
                var vTrack1 = seq.videoTracks[0];
                if (vTrack1) {
                    var now = seq.getPlayerPosition();
                    vTrack1.overwriteClip(first, now.seconds);
                }
                else {
                    alert("Could not find first video track.");
                }
            }
            else {
                alert("Couldn't locate first projectItem.");
            }
        }
        else {
            alert("No active sequence found.");
        }
    },
};
