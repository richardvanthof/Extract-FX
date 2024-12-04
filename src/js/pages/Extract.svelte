<script lang='ts'>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExclusionModal/ExcludeModal.svelte";
    import { setContext } from 'svelte';
    import type {Writable} from 'svelte/store';
    import {globals} from '../global-vars/globals.svelte';
    type Globals = {
        sourceTrack: Writable<number>,

    }
    const { sourceTrack, destination, exclusions, exclusionOptions, isExclusionModalOpen, trackTotal } = globals; 
    import { generateNumberedOptions } from '../helpers/helpers';

    const debugMode = process.env.NODE_ENV != "production"

    const trackOptions = $derived(generateNumberedOptions(globals.trackTotal, 'VIDEO'));

    setContext('exclusionOptions', globals.exclusionOptions);
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track</label>
            <DropDown options={trackOptions} value={globals.sourceTrack} store={sourceTrack}  />
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch 
                selected={globals.destination} 
                callback={(type) => globals.destination = type} 
                options={['file', 'track']} 
            />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal />
    </div>
</form>

{#if debugMode}
<details open>
    <summary>Debug</summary>
    <h3>Extract: global vars.</h3>
    <ul>
        <li>Source track: {globals.sourceTrack}</li>
        <li>Destination: {globals.destination}</li>
        <li>Exclusions: {JSON.stringify(globals.exclusions)}</li>
        <li>Exclusion options: {globals.exclusionOptions}</li>
        <li>Exclusion modal open: {globals.isExclusionModalOpen}</li>
    </ul>
</details>

{/if}
