<script>
    import Button from './Button.svelte';
  </script>
  
  <style>
    .navbar {
      display: flex;
      justify-content: space-between;
      background: var(--nav-bg);
      margin: 0;
      padding-bottom: 2em;
  
      & > a {
        color: var(--text);
        text-decoration: none;
        margin-right: .1em;
        padding: .5em;
        cursor: pointer;
        border: var(--border-weight) solid transparent;
      }
    }
  
    .nav-link {
      &:last-of-type {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
      }
  
      &:first-of-type {
        border-radius: var(--border-radius) 0 0 var(--border-radius);
      }
  
      & .active, &.active > a {
        background: var(--bg-selected);
        border-radius: var(--border-radius);
        border: var(--border-width) solid var(--border-color);
      }
    }
  
    .nav-links {
      display: flex;
      text-decoration: none;
      list-style: none;
      margin: 0;
      padding: 0;
      background: var(--bg-dark);
    }
  </style>
  
  <nav class="navbar">
    <ul class="nav-links">
      <li class="nav-link active"><a href="./index.html">Extract</a></li>
      <li class="nav-link"><a href="./ingest.html">Ingest</a></li>
    </ul>
    <Button title="Help" id="help-btn" onClick="openHelp" name="?" />
  </nav>
  