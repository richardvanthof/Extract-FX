<script>
    import DropDown from '../components/Form/DropDown.svelte'
    import SelectFile from '../components/Form/SelectFile.svelte'; 
    import ExcludeModal from '../components/Form/ExcludeModal.svelte';

    let exclusions = $state([]);
</script>

<form class="grid-container">
    <div class="grid-column">
        <div class="group">
            <label for="source-file" >Source file </label>
            <SelectFile id="source-file"/>
        </div>
        <div class="group">
            <label for="target-track" >Target track </label>
            <DropDown id="target-track"/>
        </div>
    </div>
    <div class="grid-column">
        <ExcludeModal {exclusions}/>
    </div>
</form>