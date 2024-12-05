
const targetTrack:number = document.querySelector('#sourceTrack').value;

const handleEffectExtraction = (
  targetTrack: number, 
  effectExclusionsElems:HTMLElement[], 
  destinationValue: string = 'file' || 'track'
) => {
  try {
    const csInterface = new CSInterface();
    showLoadingScreen(true)
    setLoadingCaption('Initiating...')

    // Get effect exclusions
    let effectExclusions:string[] = [];
    effectExclusionsElems.forEach((fx, index) => {
      if(fx.value != null) {
        effectExclusions.push(fx.value)
      }
      setLoadingCaption(`Fetching effect exclusion ${index}/${effectExclusionsElems.length}}`)
    })

     console.log(targetTrack)
     console.log(effectExclusionsElems)
     console.log(effectExclusions)
     
     if(!targetTrack) throw 'TargetTrack is undefined'
     if(!effectExclusions) throw 'Effect exclusions are undefined.'

     if(destinationValue === 'file') {
         const script = `$._PPP_.saveEffectstoFile(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
         setLoadingCaption('Saving effects to file...')
         csInterface.evalScript(script, handleCallback);
     } else {
         const script = `$._PPP_.copyClipEffectsToAdjustmentLayers(${targetTrack}, ${JSON.stringify(effectExclusions)})`;
         setLoadingCaption('Extracting effects to timeline...')
         csInterface.evalScript(script, handleCallback);
     }
  } catch (err) {
    throw new Error(err)
  }
}


  const extractBtn = document.querySelector('#extract-btn');
  const csInterface = new CSInterface();

  extractBtn.addEventListener("click", e => {
    // get target video track
    e.preventDefault();
    const effectExclusionsElems = document.querySelectorAll('.exclusion-dropdown');
    const activeSwitchOption = document.querySelector('.switch-option.active');
    const destinationValue = activeSwitchOption.getAttribute('data-destination');
    handleEffectExtraction(targetTrack, effectExclusionsElems, destinationValue);
  })
  
  // csInterface.evalScript('$.getVersion()', function(version) {
  //   console.log('ExtendScript engine version: ' + version);
  // });

  document.querySelectorAll('.debug').forEach(e => {
    debug ? e.classList.remove('hide') : e.classList.add('hide')
  });
