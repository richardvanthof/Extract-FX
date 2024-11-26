<script>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    import {sourceTrack, destination, exclusions, exclusionOptions} from '../global-vars/extract';
    import {trackTotal} from '../global-vars/shared';
    import {generateNumberedOptions} from '../lib/helpers';

    const setDestination = (type) => destination.set(type); //ERROR-todo
    let options = [];

    // Manually subscribe to the store
    const unsubscribe = trackTotal.subscribe(value => {
        options = generateNumberedOptions(value, 'VIDEO');  // Update options when num changes
    });

    // Clean up the subscription when the component is destroyed
    import { onDestroy } from 'svelte';
    onDestroy(() => {
        unsubscribe();
    });
</script>

<style>
    
</style>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track </label>
            <DropDown {options} value={sourceTrack} id="source-track" />
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch {destination} {setDestination} id="destination"/>
        </div>
        
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions}/>
    </div>
</form>
