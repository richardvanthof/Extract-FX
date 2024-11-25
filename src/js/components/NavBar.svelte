<script>
    import Button from './Button.svelte';
    import {currentPage} from '../main/shared';

    const handleIngestBtn = (e) => {
      e.preventDefault();
      console.log('ingest');
      alert(1)
      
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
    <li class="nav-link active" >Extract</li>
    <li class="nav-link" ><a href="#" onclick={handleIngestBtn}>Ingest</a></li>
  </ul>
  <Button title="Help" id="help-btn" onclick="openHelp" name="?" />
</nav>
