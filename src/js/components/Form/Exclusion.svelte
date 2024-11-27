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
    import { getContext } from 'svelte';
    import DropDown from "./DropDown.svelte";
    import Button from "../Button.svelte";
    import {handleClick} from '../../lib/helpers';
    
    const {exclusion, remove, update} = $props();
    const {effect, id} = exclusion;

    const optionsContext = getContext('exclusionOptions');
    const options = [['Choose an effect', null], ...optionsContext].map((option) => [option, option])

</script>

<div class='exclusion'>
    <DropDown {effect} {options} onchange={(e) => handleClick(e, update(id))} class='select'/>
    <Button data-id={id} class='remove-btn' onclick={(e) => handleClick(e, remove(id))} name='x'/>
</div>