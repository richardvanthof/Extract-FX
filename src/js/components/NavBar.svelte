<script>
    import Button from './Button.svelte';
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
      
      padding: .66em 1.5em;

      a {
        text-decoration: none;
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
      <li class="nav-link active"><a href="./index.html">Extract</a></li>
      <li class="nav-link"><a href="./ingest.html">Ingest</a></li>
    </ul>
    <Button title="Help" id="help-btn" onClick="openHelp" name="?" />
  </nav>
  