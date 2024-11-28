<script lang="ts">
    // Importing the store
    import { sourceData,  } from '../../global-vars/ingest';

    // Define the type for the source data
    type SourceData = {
        type: 'RS-FX-EXCHANGE';
        track: number;
        sequence: string;
        exclusions: string[];
        clips: object[];
    };

    let files:File[]|null|undefined = $state();

    const getUniqueKeys =(data:object[]):string[] => {
        const keys = Object.keys(data);
        return keys.filter((value, index, array) => {
            if(array.indexOf(value) === index) {
                return value;
            }
        })
    }

    const decodeJson = (file: File): Promise<SourceData> => {
    return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // FileReader event to handle the file once it's read
            reader.onload = () => {
                const content: string = reader.result as string;

                try {
                    // Try to parse JSON content
                    const parsedContent = JSON.parse(content);

                    if (parsedContent && parsedContent.type === 'RS-FX-EXCHANGE' && parsedContent.clips) {
                        resolve(parsedContent);  // Resolve the promise with parsed content
                    } else {
                        reject(new Error('File does not contain valid data.'));
                    }
                } catch (err: any) {
                    // If JSON parsing fails, show an error message
                    sourceData.set(null); // Reset the source data
                    files = [];            // Clear the files array
                    alert(err.message);    // Show the error message
                    reject(err);           // Reject the promise with the error
                }
            };

            // FileReader error event
            reader.onerror = () => {
                reject(new Error('Error reading the file.'));
            };

            // Read the file as text
            reader.readAsText(file);
        });
    };


    // Handle file input change
    const handleFile = async (event: Event) => {
        const {files} = (event.target as HTMLInputElement) || null;
        try{
            if(files && files != null && $sourceData) {
                // Decode file
                const data:Promise<SourceData> = await decodeJson(files[0]);
                sourceData.set(data || null);


            } 
        } catch (err) {
            alert(err);
        }
    };


</script>

<style>
    input {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: 3px;
        color: white;
        padding: .3em;
        display: block;
        width: 100%;
        margin-bottom: 1em;
        cursor: pointer;
    }

    pre {
        background: #f4f4f4;
        padding: 1em;
        border-radius: 4px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>

<!-- File input field that accepts only .json files -->
<input bind:files onchange={handleFile} accept="application/json" type="file">
