<script lang="ts">
    import { Writable } from 'svelte/store';
    import { getContext } from 'svelte';
    import DropDown from "./DropDown.svelte";
    import Button from "../Button.svelte";
    import { handleClick } from '../../lib/helpers';

    // Typing the Exclusion object
    type Exclusion = {
        id: string;
        effect: string | null;
    };

    // Props interface for the component
    type Props = {
        id: string;
        exclusions: Writable<Exclusion[]>; // Writable store of Exclusions
        remove: (id: string) => void; // Function to remove exclusion by id
    };

    // Destructure props with types
    const { id, exclusions, remove }: Props = $props();

    // Get the exclusion effect for this specific id
    const effect = $derived(() => {
        const exclusion = $exclusions.find((exclusion) => exclusion.id === id);
        return exclusion ? exclusion.effect : null;
    });

    // Get context for exclusion options, typed as an array of [label, value]
    const optionsContext: [string, any][] = getContext('exclusionOptions');

    // Map optionsContext to the required format
    const options: [string, any][] = [['Choose an effect', null], ...optionsContext];

    // Handle the update of effect in the exclusions store
    const handleUpdate = (newEffect: string | null) => {
        exclusions.update((currentItems) => {
            return currentItems.map((exclusion) => {
                return exclusion.id === id ? { ...exclusion, effect: newEffect } : exclusion;
            });
        });
    };
</script>
