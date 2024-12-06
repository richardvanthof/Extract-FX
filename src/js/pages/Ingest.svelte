<script lang="ts">
    import {setContext} from 'svelte';
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFIle/SelectFile.svelte'; 
    import {handleIngestFile, createExclusions} from '@/js/components/Form/SelectFIle/helpers.svelte';
    import ExcludeModal from '../components/Form/ExclusionModal/ExcludeModal.svelte';
    import {generateNumberedOptions} from '../helpers/helpers';
    import {globals} from '../global-vars/globals.svelte';
    import type {FileData} from '@/js/components/Form/SelectFIle/helpers.svelte';
    import type {Exclusion} from '../global-vars/globals.svelte';
    // Manually subscribe to the store



    let {exclusionOptions, trackTotal} = globals;
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
                globals.ingest.exclusions = createExclusions(exclusionOptions)
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
        bind:exclusions={globals.ingest.exclusions}
        bind:open={globals.isExclusionModalOpen}
    />
    </div>
</form>

{#if debugMode}
  <h3>Global data</h3>
  <ul>
    {#each Object.keys(globals) as global}

        {#if typeof globals[global] === 'object' && globals[global] !== null}
          <!-- If the value is an object, we can print it nicely (e.g., using a details element) -->
          <details>
            <summary>{global}</summary>
            <pre>{JSON.stringify(globals[global], null, 2)}</pre>
          </details>
        {:else}
          <!-- Otherwise, just print the value -->
          {global}: {globals[global]}<br/>
        {/if}

    {/each}
  </ul>
{/if}


