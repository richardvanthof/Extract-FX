<script lang='ts'>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    import { setContext } from 'svelte';
    import type {Writable} from 'svelte/store';

    type Globals = {
        sourceTrack: Writable<number>,

    }
    import { sourceTrack, destination, exclusions, exclusionOptions, isExclusionModalOpen } from '../global-vars/extract';
    import { trackTotal } from '../global-vars/shared';
    import { generateNumberedOptions } from '../lib/helpers';
    import {debugMode} from '../../../secrets';

    const setDestination = (type: 'file'| 'track') => globalThis.$destination = type; // Updates the destination store
    const trackOptions = generateNumberedOptions(globalThis.$trackTotal, 'VIDEO');
    const currentSource = $derived(globalThis.$sourceTrack);

    setContext('exclusionOptions', globalThis.$exclusionOptions);
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
                selected={globalThis.$destination} 
                callback={setDestination} 
                options={['file', 'track']} 
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
        <li>Source track: {globalThis.$sourceTrack}</li>
        <li>Destination: {globalThis.$destination}</li>
        <li>Exclusions: {JSON.stringify(globalThis.$exclusions)}</li>
        <li>Exclusion options: {globalThis.$exclusionOptions}</li>
        <li>Exclusion modal open: {globalThis.$isExclusionModalOpen}</li>
    </ul>
</details>

{/if}
