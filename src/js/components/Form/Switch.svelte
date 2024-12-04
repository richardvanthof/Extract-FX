<script lang="ts">
  import { globals } from "../../global-vars/globals.svelte";

    type Props = {
        selected: string,
        options: string[],
        callback: (option: typeof globals.destination) => void
    }
    const {selected, callback, options}: Props = $props();

</script>

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

    li {
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

<ul class="switch-input">
    {#each options as option}
        <li 
            
            class="switch-option {selected === option ? 'active' : ''}">
            <button onclick={() => callback(option)} >
                {option}
            </button>
            
        </li>
    {/each}
</ul>
