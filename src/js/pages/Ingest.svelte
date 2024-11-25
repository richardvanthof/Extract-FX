<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';
</script>

<form class="grid-container">
    <div class="grid-column">
        <label for="source-file" class="caption">Source file </label>
        <SelectFile id="source-file"/>
        <label for="target-track" class="caption">Target track </label>
        <DropDown id="target-track"/>
    </div>
    <div class="grid-column">
        <ExcludeModal/>
    </div>
</form>