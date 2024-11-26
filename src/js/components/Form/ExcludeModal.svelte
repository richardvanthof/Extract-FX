<style lang="scss">
.exclusions {
	background: var(--bg-dark);
	border: var(--border-styling);
	border-radius: var(--border-radius-inner);
	position: relative;
	margin-top: 1em;
    overflow: hidden;
}

.exclusions-controls {
  background: var(--bg-light);
  display: flex;
  justify-content: space-between;
  padding: 0.1em;
  min-width: .5em 2em;
  box-shadow: 0px .5px 5px 2px rgba(0,0,0,0.05);
}

.exclusions-container {
	min-height: 8rem;
    margin: .4em;
	/* padding-bottom: 2em; */
}

.exclusions-placeholder {
	margin: 0;
	transform: translateY(3em);
	text-align: center;
}

.exclusions {
    border-radius: var(--border-radius-outer)
}

#remove-all-exclusions-btn {
	background: none;
	border:none;
	font-size: 0.85em;
	margin: 0 0.5em;
    &:active {
        background: var(--bg-btn-active)
    }
}

.exclusion-toolbar-button {
    padding: .66em 1.5em .66em 1em;
    border: none;
    border-right: var(--border-styling);
    background: none;
    border-radius: 0;
    &:active {
        background: var(--bg-btn-active)
    }
}

button, summary {
    cursor: pointer
}
</style>

<script>
    import Exclusion from "./Exclusion.svelte";
    import { v4 as uuidv4 } from 'uuid';

    let {exclusions} = $props();

    let setExclusions = {
        add: (effect) => exclusions.push({
            effect: effect || null,
            id: uuidv4()
        }),
        update: (newEffect, targetId) => {
            const index = exclusions.findIndex(({id}) => id === targetId)
            if(index) {
                exclusions[index] = {
                    id: targetId,
                    effect: newEffect
                }
            } else {
                throw 'Update failed. Exclusion not found.'
            }
        },
        remove: (targetId) => {
            exclusions = exclusions.filter(({id}) => id != targetId)
        },
        removeAll: () => {
            exclusions = [];
        }
    }

    const {add, update, remove, removeAll} = setExclusions;

    const handleClick = (e, callback) => {
        e.preventDefault()
        return callback;
    }

</script>


<details open>
    <summary class="exclusion-header" id='exclusion-header'>Exclude effects { (exclusions.length > 0) ? `(${exclusions.length})` : ''}</summary>
    <div class="exclusions">
        <div class='exclusions-controls'>
                <button class='exclusion-toolbar-button exclusion-control' id='add-exclusion-btn' onclick={(e) => handleClick(e, add())}>+ Add Exclusion</button>
                <button class='exclusion-control' id='remove-all-exclusions-btn' onclick={(e) => handleClick(e, removeAll())}>Clear all</button>
            </div>
        <div class="exclusions-container">
            {#each exclusions as exclusion}
            <Exclusion {exclusion} {remove}/>
            {/each}
        </div>
    </div>
</details>
