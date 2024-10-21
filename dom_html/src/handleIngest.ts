const sourceFileInput = document.querySelector('#source-file');

const getUniqueKeysFromObjectList = (objects: Object[]):string[] => {
  let uniqueStrings = [];
  for(let object of objects) {
      for(let keyName in object) {
          if(!uniqueStrings.includes(keyName)) {uniqueStrings.push(keyName)}
      }
  }
  return uniqueStrings
};

// Define types for your source data, clips, and exclusions
interface Clip {
  [key: string]: any;  // Define based on the structure of your clip objects
}

interface SourceData {
  clips?: Clip[];
  exclusions?: any[];  // Define the type of exclusions properly if known
}

// Ensure necessary variables are defined
let sourceData: SourceData | null = null;
let exclusionOptions: string[] | null = null;

// Function to handle source data from the file
const handleSourceData = (file: File): void => {
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>): void => {
      try {
          // Parse the file content as JSON and ensure proper typing
          sourceData = JSON.parse(e.target.result as string) as SourceData;

          if (sourceData) {
              // Safely access `clips` to avoid errors if `clips` is undefined
              if (Array.isArray(sourceData.clips)) {
                  exclusionOptions = getUniqueKeysFromObjectList(sourceData.clips);
              } else {
                  console.warn("No valid 'clips' array found in source data.");
              }

              // Safely handle exclusions if they exist
              if (Array.isArray(sourceData.exclusions)) {
                const exclusions = sourceData.exclusions;
                setExclusionOptions(exclusionOptions);
                removeAllExclusions();
                exclusions.forEach((exclusion: any): void => {
                  console.log(exclusion)
                  addExclusion(exclusionOptions, exclusion);
                });
            } else {
                console.warn("No valid 'exclusions' array found in source data.");
            }
          }

          // Log the parsed source data for verification
          console.log(sourceData, sourceData.exclusions, exclusionOptions);

      } catch (error) {
          console.error("Error parsing JSON file:", error);
      }
  };

  // Read the file content as text
  reader.readAsText(file);
};

function handleIngestCallback(data) {
  if(data) showLoadingScreen(false);
  if (data !== true) {
      console.error(`Callback Error: ${data}`, data.message); // Log full error for debugging
      // alert(`handleCallback-error: ${data.message}`);
  }
}

const handleEffectIngestion = (
  data: SourceData,
  targetTrack: number, 
  effectExclusionsElems:HTMLElement[]
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
     
     const options = {
      exclusions: effectExclusions,
      sourceData: data,
      targetTrack: targetTrack
     };

     const script = `$._PPP_.restoreEffectsToClips(${JSON.stringify(options)})`;
     setLoadingCaption('Restoring clip effects...')
     
     csInterface.evalScript(script, handleCallback);

  } catch (err) {
    throw new Error(err)
  }
}


// Add an event listener to the file input for handling file changes
const sourceFileInput = document.querySelector("#source-file") as HTMLInputElement;
const ingestFile = document.querySelector('#ingest-btn');

sourceFileInput.addEventListener("change", (e: Event): void => {
  console.log('file changed.')
  const target = e.target as HTMLInputElement;
  const file = target.files[0];
  if (file) {
      handleSourceData(file);
  } else {
      console.warn("No file selected.");
  }
});

ingestFile.addEventListener("click", e => {
  e.preventDefault()
  const effectExclusionsElems = document.querySelectorAll('.exclusion-dropdown');
  const targetTrack:number = document.querySelector('#target-track').value;
  if(sourceData) { 
    handleEffectIngestion(sourceData, targetTrack, effectExclusionsElems)
  } else {
    alert('Please select a source file.')
  }
  
})



