"use strict";
var debug = false;
function handleCallback(data) {
    if (data)
        showLoadingScreen(false);
    if (data !== true) {
        alert(data);
        console.error(data);
    }
}
function showLoadingScreen(active) {
    if (active) {
        document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(function (e) { return e.classList.remove('hide'); });
        document.querySelectorAll('.start-view, #extract-btn, #help-btn').forEach(function (e) { return e.classList.add('hide'); });
    }
    else {
        document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(function (e) { return e.classList.add('hide'); });
        document.querySelectorAll('.start-view, #extract-btn, #help-btn').forEach(function (e) { return e.classList.remove('hide'); });
    }
}
;
$(document).ready(function () {
    document.querySelectorAll('.debug').forEach(function (e) {
        debug ? e.classList.remove('hide') : e.classList.add('hide');
    });
    $("#extract-btn").on("click", function (e) {
        e.preventDefault();
        var targetTrack = document.querySelector('#track').value;
        var csInterface = new CSInterface();
        showLoadingScreen(true);
        csInterface.evalScript("$._PPP_.copyClipEffectsToAdjustmentLayers()", handleCallback);
    });
    $("#help-btn").on("click", function (e) {
        e.preventDefault();
        var csInterface = new CSInterface();
        var OSVersion = csInterface.getOSInformation();
        var path = "file:///Library/Application Support/Adobe/CEP/extensions/Extract-FX/payloads/manual.html";
        if (OSVersion.indexOf("Windows") >= 0) {
            var path = "file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/Extract-FX/payloads/manual.html";
        }
        csInterface.openURLInDefaultBrowser(path);
    });
});
