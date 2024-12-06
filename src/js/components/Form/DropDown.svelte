<script lang="ts">
    
    type Props = {
        options: [string|number, string|number|null][],
        value: string|number,
        callback?: (newEffect: number|string) => void,
        testId?: string
    }
    let { options, value = $bindable(), callback, testId}:Props = $props();

    // Handle update when the value changes
    let handleUpdate = (event:Event) => {
        event.preventDefault();
        if(event.target && callback) {
            const target = event.target as HTMLSelectElement;
            callback(target.value);
        }
    };

    // Conditional attributes as an object
    let conditionals: Record<string, string> = {};
    if (testId) {
        conditionals["data-testid"] = testId;
    }

</script>

{#if callback}
    <select {value} {...conditionals} onchange={handleUpdate} id="sourceTrack">
        {#each options as [label, val]}
            <option value={val}>{label}</option>
        {/each}
    </select>
{:else}
    <select {...conditionals} bind:value={value} id="sourceTrack">
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