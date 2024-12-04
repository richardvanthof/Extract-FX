<script lang="ts">
    // Importing the store
    import { sourceData } from '../../global-vars/ingest';

    // Define the type for the source data
    type SourceData = {
        type: 'RS-FX-EXCHANGE';
        track: number;
        sequence: string;
        exclusions: string[];
        clips: object[];
    };

    let files:FileList | null | undefined = $state();

    // Initialize state for file content
    let fileContent: SourceData | null = null;

    // Handle file input change
    const handleFile = (event: Event) => {

        const fileInput = event.target as HTMLInputElement;
        const file:File|null|undefined = files && files[0]; // Get the first file selected

        if (file) {
            // Create a FileReader to read the file
            const reader = new FileReader();

            // FileReader event to handle the file once it's read
            reader.onload = () => {
                const content: string = reader.result as string;

                try {
                    // Try to parse JSON content
                    const parsedContent: SourceData = JSON.parse(content);

                    // Check if the file is empty or does not contain valid data
                    if (content.length === 0) {
                        throw new Error('File is empty!');
                    }

                    if (parsedContent.type !== 'RS-FX-EXCHANGE' || !parsedContent.clips) {
                        throw new Error('File does not contain valid data.');
                    }

                    // Update the store with the file content
                    sourceData.set(parsedContent);
                    
                    

                } catch (err: any) {
                    // If JSON parsing fails, show an error message
                    fileContent = null;
                    sourceData.set(null)
                    files = null;
                    alert(err.message);
                }
            };

            // Read the file as text
            reader.readAsText(file);
        } else {
            // Clear content if no file is selected
            fileContent = null;
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

</style>

<!-- File input field that accepts only .json files -->
<input bind:files={files} onchange={handleFile} accept="application/json" type="file">

