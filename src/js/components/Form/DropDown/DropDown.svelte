<script lang="ts">
    
    type Props = {
        label: string,
        hideLabel?: boolean,
        options: [string|number, string|number|null][],
        value: string|number,
        callback?: (update: number|string) => void
    }
    let { label, options, value = $bindable(), callback, hideLabel=false}:Props = $props();

    // Handle update when the value changes
    let handleUpdate = (event:Event) => {
        event.preventDefault();
        if(event.target && callback) {
            const target = event.target as HTMLSelectElement;
            callback(target.value);
        }
    };

    const id = 'select-elem-' + label.replace(' ', '-').toLowerCase();
</script>


{#if callback}
    {#if !hideLabel}
    <label for={id}>{label}</label>
    {/if}
    <select {value} {id} data-testid="dropdown-callback" onchange={handleUpdate}>
        {#each options as [label, val]}
            <option data-testid="dropdown-option" value={val}>{label}</option>
        {/each}
    </select>
{:else}
    <label for={id}>{label}</label>
    <select bind:value={value} {id} data-testid="dropdown-bind">
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