<script lang="ts">
    import { getContext } from 'svelte';
    import DropDown from "../DropDown.svelte";
    import Button from "../../Button.svelte";
    import {handleClick} from '../../../helpers/helpers';
    import type { Writable } from "svelte/store";
    import type { Exclusion } from '@/js/global-vars/globals.svelte';
    import { globals } from '@/js/global-vars/globals.svelte';
    
    type Props = { exclusions: Exclusion[], id:string, effect: string }

    let { exclusions = $bindable(), id, effect }:Props= $props();
    const optionsContext:string[] = getContext('exclusionOptions');
    const options:[string|number, string|number|null][] = [
        ['Choose an effect', null], ...optionsContext.map((option):[string, string]=>[option, option])
    ]


    // Update an exclusion item
    export const update = (newEffect: string|number, targetId:string) => {
        exclusions = exclusions.map(exclusion => { 
            if(exclusion.id === targetId) {
                return {...exclusion, effect: newEffect}
            } else {
                return exclusion
            }
        })
    }

    const remove = (id: string) => {
        console.log(`remove ${id}`);
        exclusions = exclusions.filter(({ id: exclusionId }) => exclusionId !== id);
    };
    
</script>

<div class='exclusion' data-testid="exclusion">
    <DropDown testId="select-exclusion" value={effect} {options} callback={(newEffect) => update(newEffect, id)} />
    <Button 
    onclick={(e:Event) => handleClick(e, remove(id))} 
    name='x' dataTestId="delete-exclusion" title="Delete exclusion"
    />
</div>

<style>
    .exclusion {
        margin-bottom: 0.5em;
        display: flex;
        border-right: none;
    }
</style>