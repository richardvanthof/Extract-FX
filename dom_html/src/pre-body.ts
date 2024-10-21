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







$( document ).ready(function() {
    
    
    

   
    
    // For functions which require interaction at the JavaScript level, we provide these JQuery-based
    // handlers, instead of directly invoking ExtendScript .This givs the JavaScript layer a chance
    // to pass data into the ExtendScript layer, and process the results.
    
    // $("#extract-btn").on("click", function(e){
    //     e.preventDefault(); 
    //     try {
    //         setLoadingCaption('Extracting effects...')
    //         const csInterface = new CSInterface();

    //         // get target video track
    //         const targetTrack:number = document.querySelector('#sourceTrack').value;
    //         const effectExclusionsElems = document.querySelectorAll('.exclusion-dropdown');
    //         const activeSwitchOption = document.querySelector('.switch-option.active');
    //         const destinationValue = activeSwitchOption.getAttribute('data-destination');
            
    //         let effectExclusions:string[] = [];
    //         for(let fx of effectExclusionsElems) {
    //             if(fx.value != null) {
    //                 effectExclusions.push(fx.value)
    //             }
    //         }

    //         console.log(targetTrack)
    //         console.log(effectExclusionsElems)
    //         console.log(effectExclusions)
            
    //         if(!targetTrack) throw 'TargetTrack is undefined'
    //         if(!effectExclusions) throw 'Effect exclusions are undefined.'
            
    //         showLoadingScreen(true)

    //         if(destinationValue === 'file') {
    //             const script = `$._PPP_.saveEffectstoFile(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
    //             csInterface.evalScript(script, handleCallback);
    //         } else {
    //             const script = `$._PPP_.copyClipEffectsToAdjustmentLayers(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
    //             csInterface.evalScript(script, handleCallback);
    //         }
            
    //     } catch(err) {
    //         alert(err)
    //         throw new Error(err)
    //     }
        
        
    //         //console.log(effectExclusions)
       
    // });

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

const getUniqueKeysFromObjectList = (objects: Objects):string[] => {
    const uniqueStrings = [];
    for(let object of objects) {
        for(let keyName in object) {
            if(!uniqueStrings.contains(keyName)) {uniqueStrings.push(keyName)}
        }
    }
    return uniqueStrings
};

const handleSourceData = (files) => {
    if (files.length > 0) {
        const file = files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
          // Output: The JSON data.
          sourceData = JSON.parse(e.target.result);
          if(sourceData) {
            exclusionOptions = getUniqueKeysFromObjectList(sourceData.clips)
            
            if(sourceData.exclusions) {
                sourceData.exclusions.forEach(exclusion => addExclusion())
            }
          }
          
          console.log(sourceData);
        };
        reader.readAsText(file);
    }
} 
