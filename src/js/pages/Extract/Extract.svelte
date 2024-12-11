<script lang='ts'>
    import DropDown from "@/js/components/Form/DropDown/DropDown.svelte";
    import Switch from "../../components/Form/Switch/Switch.svelte";
    import ExcludeModal from "../../components/Form/ExclusionModal/ExcludeModal.svelte";
    import { setContext } from 'svelte';
    import { globals } from '../../global-vars/globals.svelte';
    import {generateNumberedOptions} from '@/js/helpers/helpers.svelte';

    let {exclusionOptions, trackTotal } = globals;

    const trackOptions = $derived(generateNumberedOptions(trackTotal, 'VIDEO'));

    setContext('exclusionOptions', exclusionOptions);

    const handleDestinationUpdate = (selection: string) => {
      if(selection === 'file'|| selection ==='sequence') {
        globals.extract.destination = selection
      };
    };
</script>

<form data-testid="extract-form" class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track</label>
            <DropDown options={trackOptions} bind:value={globals.extract.sourceTrack}/>
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch 
                value={globals.extract.destination}
                options={['File', 'Sequence']} 
                callback={handleDestinationUpdate}
            />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal 
            bind:exclusions={globals.extract.exclusions} 
            bind:open={globals.isExclusionModalOpen} 
        />
    </div>
</form>