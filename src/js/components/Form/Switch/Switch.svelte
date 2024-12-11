<script lang="ts">
    import {handleClick} from '@/js/helpers/helpers.svelte';
    type Props = {
        value: string,
        options: string[],
        callback: (selection: string) => void,
        label?: string,
    }
    let {options, value, callback, label}: Props = $props();
    const id = label && 'switch-' + label.replace(' ', '-').toLowerCase();

</script>

{#if label}
<label for={id}>{label}</label>
{/if}
<ul class="switch-input" {id}>
    {#each options as option}
    <button 
    class="switch-option {value.toLowerCase() === option.toLowerCase() ? 'active' : ''}"
    onclick={(e:Event) => handleClick(e, callback(option.toLocaleLowerCase()))} >
        {option}
    </button>
    {/each}
</ul>


<style lang="scss">
    ul {
        margin: 0;
        margin-bottom: 0px;
        padding: 0;
        display: flex;
        padding: 0.4em;
        background: var(--bg-dark);
        justify-content: space-evenly;
        margin-bottom: 1em;
        column-gap: .5em;
        border-radius: var(--border-radius-outer);
    }

    button {
        padding: .8em 1.5em;
        background: var(--bg-light);
        list-style: none;
        width: 100%;
        text-align: center;
        justify-content: space-evenly;
        border: var(--border-styling);
        color: var(--text);
        cursor: pointer;
        border-radius: var(--border-radius-inner);
        &:active {
            background: var(--bg-btn-active);
        }
    }

    .active {
        background: var(--bg-selected);
        border: var(--border-styling-active);
        &:active {
            background: var(--bg-btn-active);
        }
    }
</style>