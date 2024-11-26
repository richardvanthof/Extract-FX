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
    const {options} = $props();
    console.log(options)
</script>

<select id="sourceTrack"> <!--TODO: make dynamic-->
{#each options as [label, value]}
<option value={value}>{label}</option>
{/each}
</select>