<script>
    import DropDown from "../components/Form/DropDown.svelte";
    import Switch from "../components/Form/Switch.svelte";
    import ExcludeModal from "../components/Form/ExcludeModal.svelte";
    const name = 'Anna';
</script>

<form class="grid-container">
    <div class="grid-column">
        <label class="caption">Source track </label>
        <DropDown />
        <label class="caption">Destination</label>
        <Switch/>
    </div>
    <div class="grid-column">
        <ExcludeModal/>
    </div>
</form>