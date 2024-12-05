<script lang="ts">
    import NavBar from '../components/NavBar.svelte';
    import Extract from '../pages/Extract.svelte';
    
    import Ingest from '../pages/Ingest.svelte';
    import Loader from '../components/Loader.svelte';
    import Footer from '../components/Footer.svelte';

    const loader = $state({isLoading: false, status: null});
    let mode = $state('extract');
    
    const setMode = (name:string) => mode = name;
</script>

<style>
    @import '../global-styles/global-styles.scss';
    main {
        margin: 1em;
    }
</style>

<NavBar {mode} {setMode}/>
<main> 
    {#if mode === 'extract'}
        <Extract/>
    {:else}
        <Ingest/>
    {/if}

    {#if loader.isLoading}
        <Loader/>
    {/if}
</main>

<Footer {mode} {loader}/>
