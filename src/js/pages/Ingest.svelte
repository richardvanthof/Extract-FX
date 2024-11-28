<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
    import {targetTrack, sourceData, exclusions, exclusionOptions, isExclusionModalOpen} from '../global-vars/ingest';
    import {trackTotal} from '../global-vars/shared';
    import {generateNumberedOptions} from '../lib/helpers';
    import {debugMode} from '../../../secrets';
    import { setContext } from 'svelte';
    // Manually subscribe to the store
    const trackOptions = generateNumberedOptions($trackTotal, 'VIDEO');
    const targetTrackVal = $derived($targetTrack);
    // const currentTarget = $derived();
    setContext('exclusionOptions', $exclusionOptions);
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file" >Source file </label>
            <SelectFile id="source-file"/>
        </div>
        <div class="group">
            <label for="target-track" >Target track </label>
            <DropDown options={trackOptions} value={targetTrack} store={targetTrack} id="target-track" />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions} options={exclusionOptions} open={isExclusionModalOpen} />
    </div>
</form>

{#if debugMode}
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

{/if}