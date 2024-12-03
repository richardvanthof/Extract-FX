<style>
.exclusion {
	margin-bottom: 0.5em;
	display: flex;
	border-right: none;
}
</style>

<script>
    import { getContext } from 'svelte';
    import DropDown from "./DropDown.svelte";
    import Button from "../Button.svelte";
    import {handleClick} from '../../lib/helpers';
    
    const {id, exclusions, remove} = $props();
    const {effect} = $derived(() => $exclusions.find(id));
    const optionsContext = getContext('exclusionOptions');
    const options = [['Choose an effect', null], ...optionsContext].map((option) => [option, option])
    const handleUpdate = (newEffect) => {
        exclusions.update(currentItems => {
            return currentItems.map((exclusion => {
                return exclusion.id === id ? {...exclusion, effect:newEffect} : exclusion
            }));
        })
    } 
</script>

<div class='exclusion' data-testid="exclusion">
    <DropDown {effect} value={effect} onchange={handleUpdate} {options}  class='select'/>
    <Button data-id={id} class='remove-btn' onclick={(e) => handleClick(e, remove(id))} name='x'/>
</div>