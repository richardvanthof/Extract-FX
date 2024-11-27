<script lang="ts">
    type Props = {
        name: string,
        title?: string,
        onclick: (event: Event | null | undefined) => any,
        ariaLabel?: string
    }
    
    const {name, title, onclick, ariaLabel}:Props = $props();
</script>

<style lang="scss">
    button {
        border: var(--border-styling);
        border-radius: var(--border-radius-inner);
        background: var(--bg-dark);
        padding: var(--inputs-padding);
        min-width: 4ch;
        cursor: pointer;
        &:active {
            background: var(--bg-btn-active)
        }
    }
</style>

<button {title} aria-label={ariaLabel} name={title} {onclick}>{name}</button>