<script lang="ts">
    import Button from '../Button.svelte';

    type Props = {
        setMode: (mode: string) => void,
        mode: string,
        options: string[] 
    }

    let {setMode, mode, options=['Extract', 'Ingest']}: Props = $props()

    const openHelp = ():void => {
      console.log('there is no help muhahahahaha')
      //TODO
    }

</script>

<style lang='scss'>

  .navbar {
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    text-decoration: none;
    list-style: none;
    padding: 0;
    margin: 0;
    border: var(--border-styling);
    border-radius: var(--border-radius-inner);
    overflow: hidden;
  }

  .nav-link {
    background: var(--bg-dark);
    cursor: pointer;
    padding: .66em 1.5em;
    text-decoration: none;
    border: var(--border-styling-transparent);
    &:active {
      background: var(--bg-btn-active)
    }

    &.active {
      background: var(--bg-btn-selected);
      border-radius: var(--border-radius);
        &:active {
        background: var(--bg-btn-active)
        }
    }
  }

</style>

<nav class="navbar">
  <ul class="nav-links">
    {#each options as option}  
      <button 
      data-testid="navbar-option" 
      class="nav-link {mode.toLowerCase() === option.toLowerCase() && 'active'}" 
      onclick={()=>setMode(option.toLowerCase())}>
      {option}
    </button>
    {/each}
  </ul>
  <Button title="Help" onclick={openHelp} name="?" />
</nav>
