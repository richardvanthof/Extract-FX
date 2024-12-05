<script lang="ts">
    
    type Props = {
        options: [string|number, string|number][],
        value: string|number,
        callback?: (updatedValue: number|string) => void,
    }
    let { options, value = $bindable(), callback}:Props = $props();

    // Handle update when the value changes
    let handleUpdate = (event:Event) => {
        event.preventDefault();
        if(event.target && callback) {
            const target = event.target as HTMLSelectElement;
            const updatedValue:any = target.value;
            callback(target.value);
        }
    };

</script>

{#if callback}
    <select {value} onchange={handleUpdate} id="sourceTrack">
        {#each options as [label, val]}
            <option value={val}>{label}</option>
        {/each}
    </select>

{:else}
    <select bind:value={value} id="sourceTrack">
        {#each options as [label, val]}
            <option value={val}>{label}</option>
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