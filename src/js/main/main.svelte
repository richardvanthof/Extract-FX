<script lang="ts">
    import NavBar from '../components/NavBar/NavBar.svelte';
    import Extract from '../pages/Extract/Extract.svelte';
    
    import Ingest from '../pages/Ingest/Ingest.svelte';
    import Loader from '@/js/components/Loader/Loader.svelte';
    import Footer from '../components/Footer.svelte';

    const loader = $state({isLoading: false, status: null});
    let mode = $state('extract');
    const options = ['Extract','Ingest'];
    const setMode = (name:string) => mode = name;
</script>

<style>
    @import '../global-styles/global-styles.scss';
    main {
        margin: 1em;
    }
</style>

<NavBar {mode} {options} {setMode}/>
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
