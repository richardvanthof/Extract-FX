<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
</script>

<form class="grid-container">
    <div class="grid-column">
        <label class="caption">Source file </label>
        <SelectFile/>
        <label class="caption">Target track </label>
        <DropDown />
    </div>
    <div class="grid-column">
        <ExcludeModal/>
    </div>
</form>