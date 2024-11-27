<style>
    select {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: var(--border-radius);
        color: var(--white);
        padding: var(--inputs-padding);
        display: block;
        width: 100%;
        cursor: pointer;
    }

    option {
        color: var(--white);
    }
</style>

<script lang="ts">
    
    import type { Writable as Writable} from "svelte/store"
    type Option = [string|number, string|number];
    type Props = {
        options: Option[],
        store?: Writable<string|number>,
        value: string|number,
        onchange?: (updatedValue: string|null) => void,
    }
    let { options, store, value, onchange }:Props = $props();

    // Handle update when the value changes
    let handleUpdate = (event:Event) => {
        if(event.target && onchange) {
            const target = event.target as HTMLSelectElement;
            const updatedValue = target.value;
            onchange(updatedValue);
        }
        
    };

</script>

<!-- Corrected binding for the value -->


{#if onchange}
    <select  {value} onchange={handleUpdate} id="sourceTrack">
        {#each options as [label, val]}
            <option value={val}>{label}</option>
        {/each}
    </select>

{:else}
    <select bind:value={$store} id="sourceTrack">
        {#each options as [label, val]}
            <option value={val}>{label}</option>
        {/each}
    </select>
{/if}
