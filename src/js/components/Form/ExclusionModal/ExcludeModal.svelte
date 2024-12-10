<script lang="ts">
    import Exclusion from "../Exclusion/Exclusion.svelte";
    import Button from "../../Button.svelte";
    import { v4 as uuid } from 'uuid';
    import type {Exclusion as ExclusionType} from '@/js/global-vars/globals.svelte.ts'

    type Props = {
        exclusions: ExclusionType[],
        open: boolean
    }

    let { exclusions = $bindable(), open = $bindable() }:Props = $props();

    // Add a new exclusion item
    const add = () => {
        exclusions = [...exclusions, {effect: null, id: uuid()}];
    };
    
    // Remove all exclusions
    const removeAll = () => exclusions = [];
</script>

<details class="wrapper" bind:open={open}>
    <summary class="exclusion-header" id='exclusion-header'>
        Exclude effects { (exclusions.length > 0) ? `(${exclusions.length})` : '' }
    </summary>
    <div class="exclusions">
        <div class='exclusions-controls'>
            <button 
                class='exclusion-toolbar-button exclusion-control' 
                id='add-exclusion-btn' 
                title="add"
                onclick={(e) => {
                    e.preventDefault();
                    add()
                }}>+ Add Exclusion
            </button>
            <button 
                class='exclusion-control' 
                title="clear"
                id='remove-all-exclusions-btn' 
                onclick={(e) => {
                    e.preventDefault();
                    removeAll()
                }}>Clear all</button>
        </div>
        <div class="exclusions-container">
            {#if exclusions.length > 0}
                {#each exclusions as {id, effect}}
                    <Exclusion bind:exclusions={exclusions} {effect} {id} />
                {/each}
            {:else}
                <div class="exclusions-placeholder">
                    <p class="caption">Press the +-button to add an exclusion.</p>
                </div>
            {/if}
        </div>
    </div>
</details>

<style lang="scss">
    .wrapper {
        margin-bottom: 1em;
    }

    .exclusions {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        position: relative;
        margin-top: 1em;
        overflow: hidden;
    }

    .exclusions-controls {
        background: var(--bg-light);
        display: flex;
        justify-content: space-between;
        padding: 0.1em;
        min-width: .5em 2em;
        box-shadow: 0px .5px 5px 2px rgba(0, 0, 0, 0.05);
    }

    .exclusions-container {
        min-height: 8rem;
        margin: .4em;
    }

    .exclusions-placeholder {
        margin: 0;
        transform: translateY(2.5em);
        text-align: center;
    }

    .exclusions {
        border-radius: var(--border-radius-outer);
    }

    #remove-all-exclusions-btn {
        background: none;
        border: none;
        font-size: 0.85em;
        padding: 0 1em;
        border-radius: var(--border-radius-inner);
        &:active {
            background: var(--bg-btn-active);
        }
    }

    
    .exclusion-toolbar-button {
        padding: .66em 1.5em .66em 1em;
        border: none;
        border-right: var(--border-styling);
        background: none;
        border-radius: 0;
        &:active {
            background: var(--bg-btn-active);
        }
    }

    button,
    summary {
        cursor: pointer;
    }
</style>
