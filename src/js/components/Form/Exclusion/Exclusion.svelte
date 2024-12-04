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
    import type { Exclusion } from '@/js/global-vars/globals.svelte';
  import { globals } from '@/js/global-vars/globals.svelte';
    
    const { exclusion }: { exclusion: Exclusion } = $props();

    const optionsContext:[string,string][] = getContext('exclusionOptions');
    const options = $derived([['Choose an effect', null], ...optionsContext].map((option) => [option, option]))
    const handleUpdate = (newEffect: string) => {
        exclusion.effect = newEffect;
    } 

    const remove = (id: string) => {
        console.log(`remove ${id}`);
        globals.exclusions = globals.exclusions.filter(({ id: exclusionId }) => exclusionId !== id);
    };
</script>

<div class='exclusion' data-testid="exclusion">
    <DropDown effect={exclusion.effect} value={exclusion.effect} onchange={handleUpdate} {options}  class='select'/>
    <Button data-id={exclusion.id} class='remove-btn' onclick={(e:Event) => handleClick(e, remove(exclusion.id))} name='x'/>
</div>