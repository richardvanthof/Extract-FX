<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFIle/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExclusionModal/ExcludeModal.svelte';
    // imp÷ort {targetTrack, sourceData, exclusions, exclusionOptions, isExclusionModalOpen} from '../global-vars/ingest';
    import {generateNumberedOptions} from '../helpers/helpers';
    import { setContext } from 'svelte';
    import {globals} from '../global-vars/globals.svelte'
    // Manually subscribe to the store
    const trackOptions = generateNumberedOptions(trackTotal, 'VIDEO');
    const {sourceTrack, exclusionOptions, trackTotal, isExclusionModalOpen} = globals;

    // const currentTarget = $derived();
    setContext('exclusionOptions', $exclusionOptions);

    const debugMode = process.env.NODE_ENV != "production"
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file">Source file</label>
            <SelectFile />
        </div>
        <div class="group">
            <label for="target-track">Target track</label>
            <!-- <DropDown options={trackOptions} value={globalThis.$targetTrack} store={targetTrack} /> -->
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions} options={exclusionOptions} open={isExclusionModalOpen} />
    </div>
</form>

<!-- {#if debugMode}
<details open>
    <summary>Debug</summary>
    <h3>Ingest: global vars</h3>
<ul>
    <li>Target track: {$targetTrack}</li>
    <li>Source Data: {JSON.stringify($sourceData)}</li>
    <li>Exclusions: {JSON.stringify($exclusions)}</li>
    <li>Exclusion options: {$exclusionOptions}</li>
    <li>Exclusion modal open: {$isExclusionModalOpen}</li>
</ul>
</details>
{/if} -->
