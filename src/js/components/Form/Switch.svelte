<script>
</script>

<style>
    ul {
        margin: 0;
        margin-bottom: 0px;
        padding: 0;
        display: flex;
        padding: 0.4em;
        background: var(--bg-dark);
        justify-content: space-evenly;
        margin-bottom: 1em;
        column-gap: .5em;
        border-radius: var(--border-radius-outer);
    }

    li {
        padding: .8em 1.5em;
        background: var(--bg-light);
        list-style: none;
        width: 100%;
        text-align: center;
        justify-content: space-evenly;
        
        color: var(--text);
        cursor: pointer;
        border-radius: var(--border-radius-inner);
    }

    .active {
        background: var(--bg-selected);
        border: var(--border-styling-teal);
    }
</style>

<ul class="switch-input">
    <li data-destination="file" class="switch-option active">File</li>
    <li data-destination="track" class="switch-option">Track</li>
</ul>