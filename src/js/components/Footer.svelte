<script lang='ts'>
    import Button from "./Button.svelte";
    import {handleClick} from '../lib/helpers';
    import config from '../../../cep.config';

    type Action = {
        name: string;
        description: string;
        method: () => void;
    };

    type Actions = {
        [key: string]: Action;  // Allows any string key with an Action type
    };

    const actions:Actions = {
        extract: {
            name: 'Extract',
            description: 'Back up video effects.',
            method: () => console.log('extract...')
        },
        ingest: {
            name: 'Ingest',
            description: 'Restore video effects to timeline.',
            method: () => console.log('restoring...')
        },
        cancel: {
            name: 'Cancel',
            description: 'Stop operation.',
            method: () => console.log('Cancelling...')
        }
    }
        
    const {mode, loader} = $props();
    const {isLoading} = $derived(loader)
    const {name, description, method} = $derived(actions[isLoading ? 'cancel' : mode]);
    
    

</script>

<style>
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1em;
        position: fixed;
        bottom: 0;
        width: 100%;
        background: var(--bg-regular);
        border-top: var(--border-styling);
    }

    .caption {
        color: var(--text-color-dark)
    }
    
    .info {
        opacity: 0.4;
        @media only screen and (max-width: 400px) {
            display: none
        }
    }
    
</style>

<footer>
    <div>
        <Button name={isLoading ? 'Cancel' : name} ariaLabel={description} onclick={(e:Event|null|undefined) => handleClick(e||null, method())} />
    </div>
    <div>
        <p class='info caption'>&#169; {config.zxp.org} {new Date().getFullYear()} - version: {__EXTRACT_FX_VERSION__}</p>
    </div>
</footer>