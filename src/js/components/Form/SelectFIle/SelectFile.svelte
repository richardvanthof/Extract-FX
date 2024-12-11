<script lang="ts">
    // Importing the store

    type Props = {
        callback: (files: Event) => void,
        error: Error|null,
        label: string
    }
    // Declare a variable to hold the files
    let {label, callback = $bindable(), error}:Props = $props();

</script>


<style>
    input {
        background: var(--bg-dark);
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        color: var(--white);
        padding: .3em;
        display: block;
        width: 100%;
        margin-bottom: .5em;
        cursor: pointer;
    }

    .error {
        border: var(--border-style-error)
     }

    .error-text {
        color: var(--error-color);
    }
</style>

<!-- File input field that accepts only .json files -->
<label for={`input-elem-${label.split(' ')[0]}`}>{label}</label>
<input id={`input-elem-${label.split(' ')[0]}`} class:error={error != null} onchange={callback} accept="application/json" type="file">
{#if error}
<p class="error-text caption">{error}</p>
{/if}
