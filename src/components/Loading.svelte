<script>
    import {onDestroy, onMount} from "svelte"
    import {LucideRefreshCw, LucideUnplug} from "lucide-svelte"

    const timeToError = 5000 // 5s

    let start = new Date()
    let interval

    let error = $state(false)

    onMount(() => {
        if (interval) clearInterval(interval)
        setInterval(() => {
            error = (new Date().getTime() > start.getTime() + timeToError)
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<div id="loading">
    {#if error}
        <LucideUnplug/>
        <h2>no data</h2>
    {:else}
        <LucideRefreshCw style="animation:var(--animation-rotate)"/>
        <h2>loading</h2>
    {/if}
</div>

<style>
    #loading {
        margin: auto 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation: var(--animation-fade-in);
    }

    #loading :global(svg) {
        height: 40px;
        width: 40px;
        margin: 0 auto;
        stroke: var(--white)
    }
</style>