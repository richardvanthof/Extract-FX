<script lang="ts">
    import {setContext} from 'svelte';
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFIle/SelectFile.svelte'; 
    import {handleIngestFile} from '@/js/components/Form/SelectFIle/helpers.svelte';
    import ExcludeModal from '../components/Form/ExclusionModal/ExcludeModal.svelte';
    import {generateNumberedOptions} from '../helpers/helpers';
    import {globals} from '../global-vars/globals.svelte';
    import type {FileData} from '@/js/components/Form/SelectFIle/helpers.svelte';
    import type {Exclusion} from '../global-vars/globals.svelte';
    // Manually subscribe to the store

    import {v4 as uuid} from 'uuid';

    let {exclusionOptions, isExclusionModalOpen, trackTotal} = globals;
    const {targetTrack, data, exclusions} = globals.ingest;
    
    
    // const currentTarget = $derived();
    setContext('exclusionOptions', exclusionOptions);
    
    const trackOptions = generateNumberedOptions(trackTotal, 'VIDEO');
    const debugMode = process.env.NODE_ENV != "production"

    let fileError:Error|unknown = $state(null);

    const handleFile = async (files: Event) => {
        try {
            fileError = null;
            const {data, exclusionOptions}:FileData|unknown = await handleIngestFile(files).catch(err => fileError = err)
            if(data) {
                fileError = null
                globals.ingest.data = data;
                globals.ingest.exclusions = data.exclusions.map((effect: string):Exclusion => ({
                    id: uuid(),
                    effect: effect
                }))
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
        
    };

</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file">Source file</label>
            <SelectFile error={fileError} callback={handleFile}/>
        </div>
        <div class="group">
            <label for="target-track">Target track</label>
            <DropDown options={trackOptions} bind:value={globals.ingest.targetTrack} />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal 
        bind:exclusions={globals.ingest.exclusions} options={exclusionOptions} 
        bind:open={isExclusionModalOpen}
    />
    </div>
</form>

{#if debugMode}
<details open>
    <summary>Debug</summary>
    <h3>Global data</h3>
    <div>
        {JSON.stringify(globals)}
    </div>
</details>
{/if}

