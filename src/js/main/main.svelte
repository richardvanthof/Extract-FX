<script>
    import NavBar from '../components/NavBar.svelte';
    import Extract from '../pages/Extract.svelte';
    import Footer from '../components/Footer.svelte';
    import Ingest from '../pages/Ingest.svelte';
    import Loader from '../components/Loader.svelte';

    const isLoading = false;
    const currentPage = 'extract';
</script>

<style>
    @import '../global-styles/global-styles.scss';
    main {
        margin: 1em;
    }
</style>

<NavBar goto="test"/>
<main> 
    {#if  true}
        <Extract/>
    {:else}
        <Ingest/>
    {/if}

    {#if isLoading}
        <Loader/>
    {/if}
</main>

<Footer {currentPage} />
