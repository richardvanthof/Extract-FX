/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe Inc.
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/

// This was relocated from index.html because syntax highlighting for JavaScript embedded in HTML is
//  unsupported (see: https://github.com/Microsoft/vscode/issues/15377#issuecomment-278578309).
// @ts-nocheck
const debug = false

function handleCallback(data) {
    if(data) showLoadingScreen(false);
    if (data !== true) {
        console.error(`Callback Error: ${data}`, data.message); // Log full error for debugging
        // alert(`handleCallback-error: ${data.message}`);
    }
}

function setLoadingCaption(message) {
    document.querySelector('#progress-caption').innerHTML = message;
}

function showLoadingScreen(active: boolean) {
    if(active) {
        document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(e => e.classList.remove('hide'));
        document.querySelectorAll('.navbar, .start-view, #extract-btn, #help-btn').forEach(e => e.classList.add('hide'));
    } else {
        document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(e => e.classList.add('hide'));
        document.querySelectorAll('.navbar, .start-view, #extract-btn, #help-btn').forEach(e => e.classList.remove('hide'));
    }
};

$( document ).ready(function() {
    const csInterface = new CSInterface();
    csInterface.evalScript('$.getVersion()', function(version) {
        console.log('ExtendScript engine version: ' + version);
    });
    

    document.querySelectorAll('.debug').forEach(e => {
        debug ? e.classList.remove('hide') : e.classList.add('hide')
    });
    
    // For functions which require interaction at the JavaScript level, we provide these JQuery-based
    // handlers, instead of directly invoking ExtendScript .This givs the JavaScript layer a chance
    // to pass data into the ExtendScript layer, and process the results.
    
    $("#extract-btn").on("click", function(e){
        e.preventDefault(); 
        try {
            setLoadingCaption('Extracting effects...')
            const csInterface = new CSInterface();

            // get target video track
            const targetTrack:number = document.querySelector('#sourceTrack').value;
            const effectExclusionsElems = document.querySelectorAll('.exclusion-dropdown');
            const activeSwitchOption = document.querySelector('.switch-option.active');
            const destinationValue = activeSwitchOption.getAttribute('data-destination');
            
            let effectExclusions:string[] = [];
            for(let fx of effectExclusionsElems) {
                if(fx.value != null) {
                    effectExclusions.push(fx.value)
                }
            }

            console.log(targetTrack)
            console.log(effectExclusionsElems)
            console.log(effectExclusions)
            
            if(!targetTrack) throw 'TargetTrack is undefined'
            if(!effectExclusions) throw 'Effect exclusions are undefined.'
            
            showLoadingScreen(true)

            if(destinationValue === 'file') {
                const script = `$._PPP_.saveEffectstoFile(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
                csInterface.evalScript(script, handleCallback);
            } else {
                const script = `$._PPP_.copyClipEffectsToAdjustmentLayers(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
                csInterface.evalScript(script, handleCallback);
            }
            
        } catch(err) {
            alert(err)
            throw new Error(err)
        }
        
        
            //console.log(effectExclusions)
       
    });

    $("#help-btn").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        
        var path = "file:///Library/Application Support/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/manual.html";
        
        if (OSVersion.indexOf("Windows") >=0){
                var path = "file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/manual.html"
        }
        csInterface.openURLInDefaultBrowser(path);	
    });

    const exclusionsContainer = document.querySelector('.exclusions-container');
    const addExclusionBtn = document.querySelector('#add-exclusion-btn');
    const removeExclusionBtn = document.querySelectorAll('.remove-exclusion')
    const removeAllExclusions = document.querySelector('#remove-all-exclusions-btn');

    let exclCounter = 0;

    function updateCounter(amount) {
        exclCounter += amount;
        console.log(exclCounter);
        const header = document.querySelector('#exclusion-header');
        if (exclCounter = 0) {
            header.innerHTML = `Exclude effects (${counter})`
        } else {
            header.innerHTML = `Exclude effects`;
        }
    }

    function togglePlaceholder() {
        if (exclusionsContainer.children.length == 0) {
            exclusionsContainer.innerHTML = '<div class="exclusions-placeholder"><h5>Add exclusion by pressing the +-button.</h5><p style="margin-top: 1em; color: rgba(255,255,255,0.4)">Tip: we recommended to exclude Warp Stabilizer and Lumetri Color.</p></div>';
        }
    }


    removeAllExclusions.addEventListener('click', e => {

            e.preventDefault();
            exclusionsContainer.innerHTML = '';
            togglePlaceholder();
        
    })

    addExclusionBtn.addEventListener('click', e => {
        let effectsList = "Color Balance (RGB),Color Replace,Gamma Correction,Extract,Color Pass,Lens Distortion,Solarize,Convolution Kernel,Levels,MPEG Source Settings,Turbulent Displace,Gradient Wipe,Ultra Key,Vector Motion,Linear Wipe,Twirl,Alpha Adjust,VR Plane to Sphere,Radial Wipe,Change to Color,RGB Curves,Echo,Ramp,Sony Raw Source Settings,Non Red Key,Lighting Effects,Eight-Point Garbage Matte,Color Balance (HLS),Vertical Flip,Broadcast Colors,Wave Warp,Venetian Blinds,Lumetri Color,Bevel Edges,Auto Levels,VR Blur,PRORES RAW Source Settings,Equalize,Shape,Checkerboard,Block Dissolve,Unsharp Mask,VR Glow,Median (Legacy),Set Matte,Set Matte,Auto Color,Spherize,Directional Blur,Difference Matte,Mirror,Noise,Noise,Roughen Edges,Bevel Alpha,Auto Contrast,Luma Corrector,Magnify,Compound Blur,VR Rotate Sphere,Pixel Motion Blur,Rolling Shutter Repair,Timewarp,Three-Way Color Corrector,Clip Name,Arithmetic,Paint Bucket,Fast Blur,Reduce Interlace Flicker,Sixteen-Point Garbage Matte,Replicate,Noise HLS Auto,Noise HLS Auto,Channel Mixer,Motion,MXF/ARRIRAW Development Settings,Alpha Glow,Cineon Converter,Posterize,Transform,Transform,Offset,Canon Cinema RAW Light Source Settings,Fast Color Corrector,ASC CDL,Text,Lightning,Gaussian Blur,Noise HLS,Noise HLS,Color Emboss,ProcAmp,Video Limiter,Black & White,Change Color,Calculations,Remove Matte,Emboss,Grid,Cineon Source Settings,Crop,VR Color Gradients,Circle,Mask2,RGB Color Corrector,RED Source Settings,Find Edges,Tint,Cell Pattern,VR De-Noise,Leave Color,Opacity,Posterize Time,Video Limiter (legacy),Lens Flare,SDR Conform,Eyedropper Fill,Luma Key,Sony RAW MXF Source Settings,Shadow/Highlight,Mask,Sharpen,Brightness & Contrast,Metadata & Timecode Burn-in,Corner Pin,Ellipse,Basic 3D,Drop Shadow,Horizontal Flip,Mosaic,4-Color Gradient,Timecode,Threshold,Threshold,Write-on,Four-Point Garbage Matte,VR Fractal Noise,Strobe Light,Radial Shadow,VR Sharpen,VR Digital Glitch,Color Key,Color Balance,Brush Strokes,CinemaDNG Source Settings,Warp Stabilizer,VR Chromatic Aberrations,Channel Blur,VR Projection,Color Space Transform,Solid Composite,Luma Curve,Dust & Scratches,Simple Text,Track Matte Key,Image Matte Key,Noise Alpha,Noise Alpha,Auto Reframe,Group,Compound Arithmetic,Edge Feather,Invert,ARRIRAW Development Settings,Blend,Texturize".split(',').sort();
        updateCounter(1)
        e.preventDefault();
        const placeholder = document.querySelector('.exclusions-placeholder');
        if(placeholder) {
            placeholder.remove();
        }

        let node = document.createElement("div");
        let rmBtn = document.createElement('button');
        let selectElem = document.createElement('select');

        
        rmBtn.classList.add('remove-exclusion');
        rmBtn.innerHTML = 'x';

        node.classList.add('exclusion')

        let selectOption = document.createElement("option");
        selectOption.value = null;  // Set the value attribute
        selectOption.textContent = 'Select effect...';  // Set the visible text
        selectElem.appendChild(selectOption);  // Add the option to the select element
        selectElem.classList.add('exclusion-dropdown')

        effectsList.forEach((effectOption) => {
            let optionElement = document.createElement("option");
            optionElement.value = effectOption;  // Set the value attribute
            optionElement.textContent = effectOption;  // Set the visible text
            selectElem.appendChild(optionElement);  // Add the option to the select element
        })
        
        rmBtn.addEventListener('click', e => {
            e.preventDefault();
            e.srcElement.parentElement.remove();
            updateCounter(-1);
            togglePlaceholder()
        })

        node.appendChild(selectElem)
        node.appendChild(rmBtn)

        exclusionsContainer.appendChild(node);
    })

    const switchSelection = (event: Event, parentElem: HTMLElement) => {
        const allOptions = Array.from(parentElem.children) as HTMLElement[];  // Convert HTMLCollection to Array
        
        // Remove 'active' class from all options
        allOptions.forEach(option => option.classList.remove('active'));
        
        // Add 'active' class to the clicked element
        const target = event.currentTarget as HTMLElement;
        target.classList.add('active');
    };
    
    const switchInput = document.querySelector('.switch-input') as HTMLElement; // Assuming this is a container for options
    
    if (switchInput) {
        const switchOptions = Array.from(switchInput.children) as HTMLElement[];  // Convert HTMLCollection to Array
    
        // Add event listeners to each switch option
        switchOptions.forEach(option => {
            option.addEventListener('click', e => switchSelection(e, switchInput));
        });
    }


    togglePlaceholder()
});