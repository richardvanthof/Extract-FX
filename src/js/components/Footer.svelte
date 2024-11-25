<script>
    import Button from "./Button.svelte";
    export let action;
    const actions = (mode) => {
        const methods = {
            extract: {
                name: 'Extract',
                description: 'Back up video effects.',
                method: () => console.log('extract...')
            },
            ingest: {
                name: 'Ingest',
                description: 'Restore video effects to timeline.',
                method: () => console.log('restoring...')
            },
            cancel: {
                name: 'Cancel',
                description: 'Stop operation.',
                method: () => console.log('Cancelling...')
            }
        }
        if(mode === 'extract') () => actions.extract;
        else if(mode === 'ingest') () => actions.ingest;
        else () => actions.cancel;
    }

    const {name, description, method} = () => actions(currentPage);

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
        <Button {name} title={description} onclick={method} />
    </div>
    <div>
        <p class='caption'>&#169; Richard Space 2024 - version 0.0.0</p>
    </div>
</footer>