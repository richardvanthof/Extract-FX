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
  box-shadow: 0px .5px 5px 2px rgba(0,0,0,0.05);
}

.exclusions-container {
	min-height: 8rem;
    margin: .4em;
	/* padding-bottom: 2em; */
}

.exclusions-placeholder {
	margin: 0;
	transform: translateY(2.5em);
	text-align: center;
}

.exclusions {
    border-radius: var(--border-radius-outer)
}

#remove-all-exclusions-btn {
	background: none;
	border:none;
	font-size: 0.85em;
	margin: 0 0.5em;
    &:active {
        background: var(--bg-btn-active)
    }
}

.exclusion-toolbar-button {
    padding: .66em 1.5em .66em 1em;
    border: none;
    border-right: var(--border-styling);
    background: none;
    border-radius: 0;
    &:active {
        background: var(--bg-btn-active)
    }
}

button, summary {
    cursor: pointer
}
</style>

<script lang="ts">
    import type {Exclusion as ExclusionType } from '../../../global-vars/shared';
    import Exclusion from "../Exclusion/Exclusion.svelte";
    import Button from "../../Button.svelte";
    import { v4 as uuidv4 } from 'uuid';
    import {handleClick} from '../../../helpers/helpers';
    let { exclusions, open } = $props();
    
    const excl = $derived($exclusions);

    // Add a new exclusion item
    const add = () => {
        exclusions.update(
            (current: ExclusionType[]) => [
                ...current,
                {
                    effect: null,  // You might want to set this dynamically
                    id: uuidv4()
                }
            ]
        );
    };

    // Update an exclusion item
    const update = (newEffect: string, id: string) => {
        exclusions.update( (currentItems: ExclusionType[]) => {
            return currentItems.map(item => item.id === id ? {...item, effect: newEffect} : item)
        })
    }

    const remove = (id: string) => {
        console.log(`remove ${id}`);
        exclusions.update((currentItems: ExclusionType[]) => {
            return currentItems.filter(({ id: exclusionId }) => exclusionId !== id);
        });
    };

    // Remove all exclusions
    const removeAll = () => exclusions.set([]);
</script>

<details class="wrapper" bind:open={$open}>
    <Button title="test" />
    <summary class="exclusion-header" id='exclusion-header'>
        Exclude effects { ($exclusions.length > 0) ? `(${$exclusions.length})` : '' }
    </summary>
    <div class="exclusions">
        <div class='exclusions-controls'>
            <button 
                class='exclusion-toolbar-button exclusion-control' 
                id='add-exclusion-btn' 
                title="add"
                onclick={(e:Event) => {
                    e.preventDefault();
                    add()
                }}>+ Add Exclusion
            </button>
            <button 
                class='exclusion-control' 
                title="clear"
                id='remove-all-exclusions-btn' 
                onclick={(e:Event) => {
                    e.preventDefault();
                    removeAll()
                }}>Clear all</button>
        </div>
        <div class="exclusions-container">
            {#if $exclusions.length > 0}
                {#each excl as {id}}
                    <Exclusion {id} {exclusions} {remove}/>
                {/each}
            {:else}
                <div class="exclusions-placeholder">
                    <p class='caption'>Press the +-button to add an exclusion.</p>
                </div>
            {/if}
            
        </div>
    </div>
</details>
