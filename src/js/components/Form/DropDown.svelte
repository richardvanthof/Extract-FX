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

<script>
    let { options, store, value, onchange } = $props();

    // Handle update when the value changes
    let handleUpdate = (event) => {
        const updatedValue = event.target.value;
        console.log('DROPDOWN - using custom handler');
        onchange(updatedValue);
    };

    const isSelected = (currentValue) => (value === currentValue);
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
