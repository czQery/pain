<script>
    import {decodeBlurHash} from "fast-blurhash"
    import {onDestroy, onMount} from "svelte"
    import {cOffline, cRefresh} from "../lib/const.js"
    import {newsFetch, newsStore} from "../lib/news.js"
    import {formatDate, formatDay} from "../lib/format.js"

    let canvas
    let blurData = $derived(new ImageData(decodeBlurHash($newsStore ? $newsStore["blur"] : "", 32, 32), 32, 32))

    let time = $state(new Date())
    let interval

    // svelte-ignore state_referenced_locally
    let refresh = time.getTime() + cOffline

    $effect(() => {
        if (!canvas) return
        canvas.getContext("2d").putImageData(blurData, 0, 0)
    })

    onMount(async () => {
        if (interval) clearInterval(interval)
        interval = setInterval(async () => {
            time = new Date()

            if (time.getTime() > refresh) {
                newsFetch()
                if (!$newsStore) {
                    refresh = time.getTime() + cOffline
                } else {
                    refresh = time.getTime() + cRefresh
                }
            }
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<a id="banner" href={$newsStore ? $newsStore["link"] : ""}>
    <div id="banner-date">
        <div id="banner-date-current">
            <h2>{formatDay(time)}</h2>
            <h3>{"- " + formatDate(time)}</h3>
        </div>
        <h3 id="banner-date-extra">{$newsStore ? (Math.round($newsStore["temp"]) + "°") : ""}</h3>
    </div>
    {#if $newsStore}
        {@const ago = Math.floor((time - (new Date($newsStore["date"]))) / 86_400_000).toString()}
        <div id="banner-news">
            <h4>{ago === "0" ? "Today: " : (ago + "d ago: ")}</h4>
            <span>{$newsStore["title"]}</span>
        </div>
    {/if}
    <canvas id="banner-blur" bind:this={canvas} width="32" height="32"></canvas>
</a>

<style>
    @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }

    #banner {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        background: var(--black);
        text-align: center;
        border-radius: var(--border);
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
        align-items: start;
        text-decoration: none;
        will-change: background-image;
    }

    #banner::after, #banner::before {
        content: '';
        position: absolute;
        background-image: conic-gradient(from var(--angle), var(--pink), var(--purple), var(--pink));
        z-index: -1;
        inset: -1px;
        border-radius: var(--border);
        animation: 3s spin linear infinite;
        will-change: transform;
    }

    #banner::before {
        filter: blur(20px);
        opacity: 0.5;
    }

    #banner-blur {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        opacity: 0.2;
        border-radius: var(--border);
    }

    #banner > *:not(canvas) {
        z-index: 15;
    }

    #banner-date {
        justify-content: space-between;
        gap: 5px;
        display: flex;
        width: 100%;
        align-items: baseline;
    }

    #banner-date-current {
        display: flex;
        align-items: baseline;
        white-space: nowrap;
        overflow: hidden;
        gap: 5px;
    }

    #banner-date-current h2 {
        color: var(--white);
    }

    #banner-date-current h3 {
        color: var(--silver);
    }

    #banner-date-extra {
        color: var(--silver);
    }

    #banner-news {
        width: 100%;
        height: auto;
        overflow: hidden;
        display: flex;
        gap: 5px;
        position: relative;
        justify-content: start;
    }

    #banner-news h4 {
        color: var(--snow);
        white-space: nowrap;
        font-size: 15px;
        line-height: 18px;
    }

    #banner-news span {
        white-space: nowrap;
        color: var(--silver);
        font-size: 15px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
        animation: typewriter 1.5s steps(60) 0s 1 normal both;
    }

    @keyframes typewriter {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    @keyframes spin {
        from {
            --angle: 0deg;
        }
        to {
            --angle: 360deg;
        }
    }
</style>