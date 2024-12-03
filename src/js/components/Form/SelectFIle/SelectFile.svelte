<script lang="ts">
    // Importing the store
    import { sourceData, exclusions } from '../../../global-vars/ingest';  // Assuming this store is used to store data globally
    import { getUniqueKeys, getJSON, SourceData } from './SelectFile.helpers';  // Utility for extracting keys from the file if needed

    // Declare a variable to hold the files
    let files: FileList | null = null;

    // Handle file input change
    const handleFile = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        const files = input?.files;

        try {
            // Decode and parse the JSON file
            if(!files) {
                throw new Error("File not found.")
            }
            const data: SourceData = await getJSON(files[0]);
            
            // Set the decoded data in the store
            sourceData.set(data);

            // Optionally: If you want to extract unique keys from the data, you can use the helper function
            const uniqueKeys = getUniqueKeys(data.clips);
            if(uniqueKeys) {
                exclusions.set(uniqueKeys);
            }

        } catch (err) {
            console.error(err);
            alert(err)
        }
    };
</script>


<style>
    input {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        color: var(--white);
        padding: .3em;
        display: block;
        width: 100%;
        margin-bottom: 1em;
        cursor: pointer;
    }
</style>

<!-- File input field that accepts only .json files -->
<input bind:files={files} onchange={handleFile} accept="application/json" type="file">
