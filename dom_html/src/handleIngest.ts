const sourceFileInput = document.querySelector('#source-file');

const getUniqueKeysFromObjectList = (objects: Objects):string[] => {
  const uniqueStrings = [];
  for(let object of objects) {
      for(let keyName in object) {
          if(!uniqueStrings.contains(keyName)) {uniqueStrings.push(keyName)}
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
          sourceData = JSON.parse(e.target?.result as string) as SourceData;

          if (sourceData) {
              // Safely access `clips` to avoid errors if `clips` is undefined
              if (Array.isArray(sourceData.clips)) {
                  exclusionOptions = getUniqueKeysFromObjectList(sourceData.clips);
              } else {
                  console.warn("No valid 'clips' array found in source data.");
              }

              // Safely handle exclusions if they exist
              if (Array.isArray(sourceData.exclusions)) {
                  sourceData.exclusions.forEach((exclusion: any): void => {
                    addExclusion(exclusionOptions, exclusion);  // Pass the exclusion parameter to addExclusion
                  });
              } else {
                  console.warn("No valid 'exclusions' array found in source data.");
              }
          }

          // Log the parsed source data for verification
          console.log(sourceData);
      } catch (error) {
          console.error("Error parsing JSON file:", error);
      }
  };

  // Read the file content as text
  reader.readAsText(file);
};

// Add an event listener to the file input for handling file changes
const sourceFileInput = document.getElementById("sourceFileInput") as HTMLInputElement;

sourceFileInput.addEventListener("change", (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
      handleSourceData(file);
  } else {
      console.warn("No file selected.");
  }

  console.log(file);
});



