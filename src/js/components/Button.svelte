<script lang="ts">
    type Props = {
        name?: string,
        title: string,
        onclick?: (event: Event) => void,
        dataTestId?: string
    };

    const { name, title, onclick, dataTestId }: Props = $props();

    // Conditional attributes as an object
    let conditionals: Record<string, string> = {};
    if (dataTestId) {
        conditionals["data-testid"] = dataTestId;
    }
</script>

<!-- Button with dynamic attributes spread -->
<button {title} {...conditionals} name={name || title} {onclick}>
    {name || title}
</button>

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
