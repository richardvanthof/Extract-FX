"use strict";
var debug = false;
function handleCallback(data) {
    if (data)
        showLoadingScreen(false);
    if (data !== true) {
        console.error("Callback Error: " + data, data.message);
        alert("handleCallback-error: " + data.message);
    }
}
function setLoadingCaption(message) {
    document.querySelector('#progress-caption').innerHTML = message;
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
    var csInterface = new CSInterface();
    csInterface.evalScript('$.getVersion()', function (version) {
        console.log('ExtendScript engine version: ' + version);
    });
    document.querySelectorAll('.debug').forEach(function (e) {
        debug ? e.classList.remove('hide') : e.classList.add('hide');
    });
    $("#extract-btn").on("click", function (e) {
        e.preventDefault();
        try {
            setLoadingCaption('Extracting effects...');
            var csInterface_1 = new CSInterface();
            var targetTrack = document.querySelector('#track').value;
            var effectExclusionsElems = document.querySelectorAll('.exclusion-dropdown');
            var effectExclusions = [];
            for (var _i = 0, effectExclusionsElems_1 = effectExclusionsElems; _i < effectExclusionsElems_1.length; _i++) {
                var fx = effectExclusionsElems_1[_i];
                if (fx.value != null) {
                    effectExclusions.push(fx.value);
                }
            }
            console.log(targetTrack);
            console.log(effectExclusionsElems);
            console.log(effectExclusions);
            if (!targetTrack)
                throw 'TargetTrack is undefined';
            if (!effectExclusions)
                throw 'Effect exclusions are undefined.';
            showLoadingScreen(true);
            var script = "$._PPP_.copyClipEffectsToAdjustmentLayers(" + targetTrack + ", " + JSON.stringify(effectExclusions) + ")";
            csInterface_1.evalScript(script, handleCallback);
        }
        catch (err) {
            alert(err);
            throw new Error(err);
        }
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
    var exclusionsContainer = document.querySelector('.exclusions-container');
    var addExclusionBtn = document.querySelector('#add-exclusion-btn');
    var removeExclusionBtn = document.querySelectorAll('.remove-exclusion');
    var removeAllExclusions = document.querySelector('#remove-all-exclusions-btn');
    var exclCounter = 0;
    function updateCounter(amount) {
        exclCounter += amount;
        console.log(exclCounter);
        var header = document.querySelector('#exclusion-header');
        if (exclCounter = 0) {
            header.innerHTML = "Exclude effects (" + counter + ")";
        }
        else {
            header.innerHTML = "Exclude effects";
        }
    }
    function togglePlaceholder() {
        if (exclusionsContainer.children.length == 0) {
            exclusionsContainer.innerHTML = '<div class="exclusions-placeholder"><h5>Add exclusion by pressing the +-button.</h5><p style="margin-top: 1em; color: rgba(255,255,255,0.4)">Tip: we recommended to exclude Warp Stabilizer and Lumetri Color.</p></div>';
        }
    }
    removeAllExclusions.addEventListener('click', function (e) {
        e.preventDefault();
        exclusionsContainer.innerHTML = '';
        togglePlaceholder();
    });
    addExclusionBtn.addEventListener('click', function (e) {
        var effectsList = "Color Balance (RGB),Color Replace,Gamma Correction,Extract,Color Pass,Lens Distortion,Solarize,Convolution Kernel,Levels,MPEG Source Settings,Turbulent Displace,Gradient Wipe,Ultra Key,Vector Motion,Linear Wipe,Twirl,Alpha Adjust,VR Plane to Sphere,Radial Wipe,Change to Color,RGB Curves,Echo,Ramp,Sony Raw Source Settings,Non Red Key,Lighting Effects,Eight-Point Garbage Matte,Color Balance (HLS),Vertical Flip,Broadcast Colors,Wave Warp,Venetian Blinds,Lumetri Color,Bevel Edges,Auto Levels,VR Blur,PRORES RAW Source Settings,Equalize,Shape,Checkerboard,Block Dissolve,Unsharp Mask,VR Glow,Median (Legacy),Set Matte,Set Matte,Auto Color,Spherize,Directional Blur,Difference Matte,Mirror,Noise,Noise,Roughen Edges,Bevel Alpha,Auto Contrast,Luma Corrector,Magnify,Compound Blur,VR Rotate Sphere,Pixel Motion Blur,Rolling Shutter Repair,Timewarp,Three-Way Color Corrector,Clip Name,Arithmetic,Paint Bucket,Fast Blur,Reduce Interlace Flicker,Sixteen-Point Garbage Matte,Replicate,Noise HLS Auto,Noise HLS Auto,Channel Mixer,Motion,MXF/ARRIRAW Development Settings,Alpha Glow,Cineon Converter,Posterize,Transform,Transform,Offset,Canon Cinema RAW Light Source Settings,Fast Color Corrector,ASC CDL,Text,Lightning,Gaussian Blur,Noise HLS,Noise HLS,Color Emboss,ProcAmp,Video Limiter,Black & White,Change Color,Calculations,Remove Matte,Emboss,Grid,Cineon Source Settings,Crop,VR Color Gradients,Circle,Mask2,RGB Color Corrector,RED Source Settings,Find Edges,Tint,Cell Pattern,VR De-Noise,Leave Color,Opacity,Posterize Time,Video Limiter (legacy),Lens Flare,SDR Conform,Eyedropper Fill,Luma Key,Sony RAW MXF Source Settings,Shadow/Highlight,Mask,Sharpen,Brightness & Contrast,Metadata & Timecode Burn-in,Corner Pin,Ellipse,Basic 3D,Drop Shadow,Horizontal Flip,Mosaic,4-Color Gradient,Timecode,Threshold,Threshold,Write-on,Four-Point Garbage Matte,VR Fractal Noise,Strobe Light,Radial Shadow,VR Sharpen,VR Digital Glitch,Color Key,Color Balance,Brush Strokes,CinemaDNG Source Settings,Warp Stabilizer,VR Chromatic Aberrations,Channel Blur,VR Projection,Color Space Transform,Solid Composite,Luma Curve,Dust & Scratches,Simple Text,Track Matte Key,Image Matte Key,Noise Alpha,Noise Alpha,Auto Reframe,Group,Compound Arithmetic,Edge Feather,Invert,ARRIRAW Development Settings,Blend,Texturize".split(',').sort();
        updateCounter(1);
        e.preventDefault();
        var placeholder = document.querySelector('.exclusions-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        var node = document.createElement("div");
        var rmBtn = document.createElement('button');
        var selectElem = document.createElement('select');
        rmBtn.classList.add('remove-exclusion');
        rmBtn.innerHTML = 'x';
        node.classList.add('exclusion');
        var selectOption = document.createElement("option");
        selectOption.value = null;
        selectOption.textContent = 'Select effect...';
        selectElem.appendChild(selectOption);
        selectElem.classList.add('exclusion-dropdown');
        effectsList.forEach(function (effectOption) {
            var optionElement = document.createElement("option");
            optionElement.value = effectOption;
            optionElement.textContent = effectOption;
            selectElem.appendChild(optionElement);
        });
        rmBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.srcElement.parentElement.remove();
            updateCounter(-1);
            togglePlaceholder();
        });
        node.appendChild(selectElem);
        node.appendChild(rmBtn);
        exclusionsContainer.appendChild(node);
    });
    togglePlaceholder();
});
