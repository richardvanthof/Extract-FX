<style>
.exclusion {
	margin-bottom: 0.5em;
	display: flex;
	border-right: none;
}
</style>

<script lang="ts">
    import { getContext } from 'svelte';
    import DropDown from "../DropDown.svelte";
    import Button from "../../Button.svelte";
    import {handleClick} from '../../../helpers/helpers';
    import type { Writable } from "svelte/store";
    import type { Exclusion } from '~/js/global-vars/shared';
    
    interface Props {
		id: string,
        exclusions: Writable<Exclusion[]>,
        remove: (id: string) => void,
		[key: string]: unknown;
	}
    
    const {id, exclusions, remove}:Props = $props();
    const {effect} = $derived(() => $exclusions.find(id));
    const optionsContext = getContext('exclusionOptions');
    const options = [['Choose an effect', null], ...optionsContext].map((option) => [option, option])
    const handleUpdate = (newEffect: string) => {
        exclusions.update((currentItems:Exclusion[]) => {
            return currentItems.map((exclusion => {
                return exclusion.id === id ? {...exclusion, effect:newEffect} : exclusion
            }));
        })
    } 
</script>

<div class='exclusion' data-testid="exclusion">
    <DropDown {effect} value={effect} onchange={handleUpdate} {options}  class='select'/>
    <Button data-id={id} class='remove-btn' onclick={(e:Event) => handleClick(e, remove(id))} name='x'/>
</div>