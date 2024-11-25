<script type="ts">
    import NavBar from '../components/NavBar.svelte';
    import Extract from '../pages/Extract.svelte';
    import Footer from '../components/Footer.svelte';
    import Ingest from '../pages/Ingest.svelte';
    import Loader from '../components/Loader.svelte';
    
    let isLoading:boolean = false;
    const mode: 'extract' | 'ingest' = 'extract';
</script>

<style>
    @import '../global-styles/global-styles.scss';
    main {
        margin: 1em;
    }
</style>


<NavBar/>
<main> 
    {#if mode === 'extract'}
        <Extract/>
    {:else}
        <Ingest/>
    {/if}

    {#if isLoading}
        <Loader/>
    {/if}
</main>
<Footer {mode}}/>