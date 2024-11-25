<script>
    import Button from "./Button.svelte";

    export let mode = '';
</script>

<style>
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1em;
        position: fixed;
        bottom: 0;
        width: 100%;
        background: var(--bg-regular);
        border-top: var(--border-styling);
    }

    .caption {
        color: var(--text-color-dark)
    }
</style>

<footer>
    <div>
        {#if mode === 'ingest'}
        <Button name="Ingest" title="Restore effects to timeline" id="extract-btn" />
        {:else if mode == 'extract'}
        <Button name="Extract" title="Extract effects frin timeline" id="extract-btn" />
        {:else}
        <Button name="Cancel" title="Cancel process" id="cancel-btn" onClick="window.location.reload()"/>
        {/if}
    </div>
    <div>
        <p class='caption'>&#169; Richard Space 2024</p>
    </div>
</footer>