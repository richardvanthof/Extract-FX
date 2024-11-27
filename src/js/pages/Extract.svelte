<script>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    import { setContext } from 'svelte';
    import { sourceTrack, destination, exclusions, exclusionOptions, isExclusionModalOpen } from '../global-vars/extract';
    import { trackTotal } from '../global-vars/shared';
    import { generateNumberedOptions } from '../lib/helpers';
    import {debugMode} from '../../../secrets';

    const setDestination = (type) => $destination = type; // Updates the destination store
    const trackOptions = generateNumberedOptions($trackTotal, 'VIDEO');
    const currentSource = $derived($sourceTrack);

    setContext('exclusionOptions', $exclusionOptions);
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track</label>
            <DropDown options={trackOptions} value={currentSource} store={sourceTrack}  />
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch 
                selected={$destination} 
                callback={setDestination} 
                options={['file', 'track']} 
                id="destination"
            />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions} options={exclusionOptions} open={isExclusionModalOpen}/>
    </div>
</form>

{#if debugMode}
<details open>
    <summary>Debug</summary>
    <h3>Extract: global vars.</h3>
    <ul>
        <li>Source track: {$sourceTrack}</li>
        <li>Destination: {$destination}</li>
        <li>Exclusions: {JSON.stringify($exclusions)}</li>
        <li>Exclusion options: {$exclusionOptions}</li>
        <li>Exclusion modal open: {$isExclusionModalOpen}</li>
    </ul>
</details>

{/if}
