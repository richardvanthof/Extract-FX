<script lang="ts">
    import DropDown from '../components/Form/DropDown.svelte';
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
    import { targetTrack, sourceData, exclusions, exclusionOptions, isExclusionModalOpen } from '../global-vars/ingest';
    import { trackTotal } from '../global-vars/shared';
    import { generateNumberedOptions, NumberedOption } from '../lib/helpers';
    import { debugMode } from '../../../secrets';
    import { setContext } from 'svelte';

    // Generate track options
    const trackOptions: NumberedOption[] = generateNumberedOptions(globalThis.$trackTotal, 'VIDEO');

    
    // Context for exclusionOptions
    setContext('exclusionOptions', globalThis.$exclusionOptions);
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file">Source file</label>
            <SelectFile />
        </div>
        <div class="group">
            <label for="target-track">Target track</label>
            <DropDown options={trackOptions} value={globalThis.$targetTrack} store={targetTrack} />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions} options={globalThis.$exclusionOptions} open={globalThis.$isExclusionModalOpen} />
    </div>
</form>

{#if debugMode}
<details open>
    <summary>Debug</summary>
    <h3>Ingest: global vars</h3>
    <ul>
        <li>Target track: {globalThis.$targetTrack}</li>
        <li>Source Data: {JSON.stringify(globalThis.$sourceData)}</li>
        <li>Exclusions: {globalThis.$exclusions}</li>
        <li>Exclusion options: {globalThis.$exclusionOptions}</li>
        <li>Exclusion modal open: {globalThis.$isExclusionModalOpen}</li>
    </ul>
</details>
{/if}
