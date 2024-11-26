<script>
    const {name, title, onclick} = $props();
</script>

<style lang="scss">
    button {
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        background: var(--bg-dark);
        padding: var(--inputs-padding);
        min-width: 4ch;

        &:active {
            background: var(--bg-btn-active)
        }
    }
</style>

<button {title} {onclick}>{name}</button>