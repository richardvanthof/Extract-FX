<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
    import {targetTrack, sourceFile, exclusions, exclusionOptions} from '../global-vars/ingest';
    import {trackTotal} from '../global-vars/shared';
    import {generateNumberedOptions} from '../lib/helpers';

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

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file" >Source file </label>
            <SelectFile id="source-file"/>
        </div>
        <div class="group">
            <label for="target-track" >Target track </label>
            <DropDown {options} value={targetTrack} id="target-track"/>
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions}/>
    </div>
</form>