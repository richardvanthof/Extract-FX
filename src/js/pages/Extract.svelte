<script>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    import { sourceTrack, destination, exclusions, exclusionOptions } from '../global-vars/extract';
    import { trackTotal } from '../global-vars/shared';
    import { generateNumberedOptions } from '../lib/helpers';

    const setDestination = (type) => destination.set(type); // Updates the destination store
    let options = [];

    // Manually subscribe to the store
    const unsubscribe = trackTotal.subscribe(value => {
        options = generateNumberedOptions(value, 'VIDEO');  // Update options when trackTotal changes
    });

    // Clean up the subscription when the component is destroyed
    import { onDestroy } from 'svelte';
    onDestroy(() => {
        unsubscribe();
    });
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track</label>
            <DropDown {options} value={sourceTrack} id="source-track" />
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
        <ExcludeModal {exclusions}/>
    </div>
</form>
