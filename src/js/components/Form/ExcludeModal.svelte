<style lang="scss">
.exclusions {
	background: var(--bg-dark);
	border: var(--border-styling);
	border-radius: var(--border-radius-inner);
	position: relative;
	margin-top: 1em;
}



.exclusions-controls {
  background: #272626;
  display: flex;
  justify-content: space-between;
  padding: 0.1em;
  min-width: .5em 2em;
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
</style>

<script>
import Exclusion from "./Exclusion.svelte";
</script>


<details open>
    <summary class="exclusion-header" id='exclusion-header'>Exclude effects</summary>
    <div class="exclusions">
        <div class='exclusions-controls'>
                <button class='exclusion-toolbar-button exclusion-control' id='add-exclusion-btn'>+ Add Exclusion</button>
                <button class='exclusion-control' id='remove-all-exclusions-btn'>Clear all</button>
            </div>
        <div class="exclusions-container">
            <Exclusion/>
            <Exclusion/>
            <Exclusion/>
        </div>
    </div>
</details>
