<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
    import {targetTrack, sourceFile, exclusions, exclusionOptions} from '../global-vars/ingest';
    import {trackTotal} from '../global-vars/shared';
    import {generateNumberedOptions} from '../lib/helpers';
    import {debugMode} from '../../../secrets';

    // Manually subscribe to the store
    const trackOptions = generateNumberedOptions($trackTotal, 'VIDEO');

</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file" >Source file </label>
            <SelectFile id="source-file"/>
        </div>
        <div class="group">
            <label for="target-track" >Target track </label>
            <DropDown options={trackOptions} selected={targetTrack} value={$targetTrack} id="target-track" />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions}/>
    </div>
</form>

{#if debugMode}
<details>
    <summary>Debug</summary>
    <h3>Current data</h3>
<ul>
    <li>Target track: {$targetTrack}</li>
    <li>sourceFile: {$sourceFile}</li>
    <li>Exclusions: {$exclusions}</li>
    <li>Exclusion options: {$exclusionOptions}</li>
</ul>
</details>

{/if}