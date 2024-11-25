<script>
    import NavBar from '../components/NavBar.svelte';
    import Extract from '../pages/Extract.svelte';
    import Footer from '../components/Footer.svelte';
  import Ingest from '../pages/Ingest.svelte';
  import Loader from '../components/Loader.svelte';
    const mode = 'extract'
</script>

<style>
    @import '../global-styles/normalize.scss';
    @import '../global-styles/variables.scss';
    @import '../global-styles/globals.scss';
    
    main {
        margin: 1em;
    }
</style>

<NavBar/>
<!-- <Loader/> -->
<main>
    {#if mode === 'extract'}
        <Extract/>
    {:else if mode === 'ingest'}
        <Ingest/>
    {:else}
        <Loader/>
    {/if}
</main>
<Footer {mode}}/>