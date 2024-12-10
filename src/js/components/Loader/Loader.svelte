<script lang='ts'>
    type Props = {
        message?: string,
        progress?: number
    }
    const {message = 'loading...', progress}: Props = $props();
</script>

<style>
    div {
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--bg-loader);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); 
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(5px);
    }
</style>

<div>
    <progress value={progress} ></progress>
	<p class="caption">{message}</p>
</div>