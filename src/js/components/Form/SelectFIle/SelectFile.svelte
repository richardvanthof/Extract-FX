<script lang="ts">
    // Importing the store
    import { globals } from '@/js/global-vars/globals.svelte';  // Assuming this store is used to store data globally
    import { getUniqueKeys, getJSON } from './SelectFile.helpers';  // Utility for extracting keys from the file if needed
    import type {SourceData} from './SelectFile.helpers';
    import type {Writable} from 'svelte/store';
    import {get} from 'svelte/store';
    import {v4 as uuid} from 'uuid';

    // Declare a variable to hold the files
    let files: FileList | null = null;

    // Handle file input change
    const handleFile = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        const files = input?.files;

        try {
            // Decode and parse the JSON file
            if(!files) {throw new Error("File not found.")}
            const decodedData: SourceData = await getJSON(files[0]);
        
            // Set the decoded data in the store
            sourceData.set(decodedData);
            
            const uniqueKeys = getUniqueKeys(decodedData.clips);
            
            // Optionally: If you want to extract unique keys from the data, you can use the helper function
            if(uniqueKeys) {exclusionOptions.set(uniqueKeys);}

            // Add all the exclusions from the source file to the exclude panel.
            if(decodedData && exclusions) {
                exclusions.set(decodedData.exclusions.map((exclusion) => ({
                    effect: exclusion,
                    id: uuid()
                })))
            };

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
