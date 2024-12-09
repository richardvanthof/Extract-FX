<script lang="ts">
    
    type Props = {
        options: [string|number, string|number|null][],
        value: string|number,
        callback?: (update: number|string) => void
    }
    let { options, value = $bindable(), callback}:Props = $props();

    // Handle update when the value changes
    let handleUpdate = (event:Event) => {
        event.preventDefault();
        if(event.target && callback) {
            const target = event.target as HTMLSelectElement;
            callback(target.value);
        }
    };


</script>

{#if callback}
    <select {value} data-testid="dropdown-callback" onchange={handleUpdate} id="sourceTrack">
        {#each options as [label, val]}
            <option data-testid="dropdown-option" value={val}>{label}</option>
        {/each}
    </select>
{:else}
    <select bind:value={value} data-testid="dropdown-bind" id="sourceTrack">
        {#each options as [label, val]}
            <option data-testid="dropdown-option" value={val}>{label}</option>
        {/each}
    </select>
{/if}


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