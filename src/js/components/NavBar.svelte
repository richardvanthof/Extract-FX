<script>
    import Button from './Button.svelte';

    let {setMode, mode} = $props()

    const modes = ['extract', 'ingest']
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
    {#each modes as modeName}
		 <!-- <li class="nav-link class:active={() => mode === 'extract'} onclick={() => setMode('extract')}>Extract</li> -->
      <li class="nav-link {mode === modeName && 'active'}" onclick={()=>setMode(modeName)}>{modeName}</li>
     
    {/each}
    
  </ul>
  <Button title="Help" id="help-btn" onclick="openHelp" name="?" />
</nav>
