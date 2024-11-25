<style>
.exclusion {
	margin: 0.5em;
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
</script>

<div class='exclusion'>
    <DropDown class='select'/>
    <Button class='remove-btn' name='x'/>
</div>