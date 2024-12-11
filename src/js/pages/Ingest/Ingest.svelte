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
    let fileMetadata:string|null = $state(null);

    const handleFile = async (files: Event) => {
        try {
            fileError = null;
            fileMetadata = null;
            const {data, exclusionOptions}:FileData = await handleIngestFile(files).catch(err => fileError = err)
            if(data) { 
                globals.ingest.data = data; 
            }
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
{#if globals.ingest.data != null}
<div class="inspector">
    <p class="caption title">Current ingest data</p>
    <ul>
        <li>
            <p class="label caption">Source sequence</p>
            <h6 class="value">{globals.ingest.data.sequence}</h6>
        </li>
        <li>
            <p class="label caption">Clips amount</p>
            <h6 class="value">{globals.ingest.data.clips.length}</h6>
        </li>
        <li>
            <p class="label caption">Effects amount</p>
            <h6 class="value">{globals.ingest.data.sequence}</h6>
        </li>
        <li>
            <p class="label caption">Created</p>
            <h6 class="value">{globals.ingest.data.sequence}</h6>
        </li>
    </ul>
</div>
{/if}

<style type="scss">
    .inspector {
        margin: 0;
        margin-top: 0.5em;
        padding: .75em 1em;
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        position: relative;
        ul {
            display: flex;
            justify-content: space-around;
            margin:0;
            padding: 0;
            li {
                list-style: none;
                margin: 0;
                flex-grow: 1;
                padding: 0;
                display: block;
                border-right: var(--border-styling);
                margin-right: 1.33em;
                &:last-child {
                    border: none
                }
            }
        }
    }

    .label {
        margin-bottom: .33em;
        display: block;
    }

    .value {
        display: block;
        margin-bottom: .3em;
    }

    .title {
        position: absolute;
        padding: 0 .5em;
        transform: translate(-0.5em,-2em);
        background: var(--bg-regular);
        font-size: 0.85rem;
        color: var(--text-color-darkest);
    }
</style>


