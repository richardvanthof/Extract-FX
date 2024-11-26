<style>
.exclusion {
	margin-bottom: 0.5em;
	display: flex;
	border-right: none;
}

.remove-btn {
	padding: 0 1em;
    flex-grow: 0;
    width: 1em;
}

select {
    flex-grow: 1;
    margin-bottom: 0;
}
</style>

<script>
    import DropDown from "./DropDown.svelte";
    import Button from "../Button.svelte";

    const {exclusion, remove} = $props();
    const {effect, id} = exclusion;

    const handleClick = (e, callback) => {
        e.preventDefault()
        return callback;
    }
</script>

<div class='exclusion'>
    <DropDown {effect} class='select'/>
    <Button data-id={id} class='remove-btn' onclick={(e) => handleClick(e, remove(id))} name='x'/>
</div>