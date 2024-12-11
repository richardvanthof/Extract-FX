<script lang="ts">
    import {setContext} from 'svelte';
    import DropDown from '@/js/components/Form/DropDown/DropDown.svelte';
    import SelectFile from '../../components/Form/SelectFIle/SelectFile.svelte'; 
    import {handleIngestFile, createExclusions} from '@/js/components/Form/SelectFIle/helpers.svelte';
    import ExcludeModal from '../../components/Form/ExclusionModal/ExcludeModal.svelte';
    import {generateNumberedOptions} from '@/js/helpers/helpers.svelte';
    import {globals} from '../../global-vars/globals.svelte';
    import type {FileData} from '@/js/components/Form/SelectFile/helpers.svelte';


    let {exclusionOptions, trackTotal} = globals;    
    
    // const currentTarget = $derived();
    setContext('exclusionOptions', exclusionOptions);
    
    const trackOptions = generateNumberedOptions(trackTotal, 'VIDEO');
    
    let fileError:Error|null = $state(null);

    const handleFile = async (files: Event) => {
        try {
            fileError = null;
            const {data, exclusionOptions}:FileData = await handleIngestFile(files).catch(err => fileError = err)
            if(data) { globals.ingest.data = data; }
            if(exclusionOptions){ globals.ingest.exclusions = createExclusions(exclusionOptions)}
        } catch (err) {
            console.error(err);
            alert(err)
        }
        
    };

</script>

<form data-testid="ingest-form" class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file">Source file</label>
            <SelectFile error={fileError} callback={handleFile}/>
        </div>
        <div class="group">
            <label for="target-track">Target track</label>
            <DropDown options={trackOptions} bind:value={globals.ingest.targetTrack} />
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal 
        bind:exclusions={globals.ingest.exclusions}
        bind:open={globals.isExclusionModalOpen}
    />
    </div>
</form>


