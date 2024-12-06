<script lang='ts'>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExclusionModal/ExcludeModal.svelte";
    import { setContext } from 'svelte';
    import { globals } from '../global-vars/globals.svelte';
    import { generateNumberedOptions } from '../helpers/helpers';

    let {exclusionOptions, trackTotal, isExclusionModalOpen} = globals;
    let {exclusions, destination, sourceTrack} = globals.extract; 

    const debugMode = process.env.NODE_ENV != "production"
    const trackOptions = $derived(generateNumberedOptions(trackTotal, 'VIDEO'));

    setContext('exclusionOptions', exclusionOptions);

    const handleDestinationUpdate = (selection: "file"|"sequence") => globals.extract.destination = selection;
    const handleTrackUpdate = (update: string) => globals.extract.sourceTrack = Number(update)
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track</label>
            <DropDown options={trackOptions} bind:value={globals.extract.sourceTrack}/>
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch 
                value={globals.extract.destination}
                options={['File', 'Sequence']} 
                callback={handleDestinationUpdate}
            />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal 
            bind:exclusions={globals.extract.exclusions} 
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
