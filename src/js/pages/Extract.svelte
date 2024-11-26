<script>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    

    let destination = $state('file');
    let exclusions = $state([]);

    const setDestination = (type) => destination = type;

    

</script>

<style>
    .group {
        margin-bottom: 1.33em;
    }
</style>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-track">Source track </label>
            <DropDown id="source-track" />
        </div>
        <div class="group">
            <label for="destination">Destination</label>
            <Switch {destination} {setDestination} id="destination"/>
        </div>
        
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions}/>
    </div>
</form>