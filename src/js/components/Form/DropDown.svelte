<style>
    select {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: var(--border-radius);
        color: var(--white);
        padding: var(--inputs-padding);
        display: block;
        width: 100%;
    }

    option {
        color: var(--white);
    }
</style>

<script>
    const options = [['option 1', 1], ['option 2' , 2]]
</script>

<select id="sourceTrack"> <!--TODO: make dynamic-->
{#each options as [label, value]}
<option value={value}>{label}</option>
{/each}
</select>