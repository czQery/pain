<script>
    import {decodeBlurHash} from "fast-blurhash"
    import {onDestroy, onMount} from "svelte"
    import {cOffline} from "../lib/const.js"
    import {newsFetch, newsStore} from "../lib/news.js"
    import {formatOrdinalNumber} from "../lib/format.js"

    let canvas
    let blurData = $derived(new ImageData(decodeBlurHash($newsStore ? $newsStore[0]["blur"] : "", 32, 32), 32, 32))

    let time = $state(new Date())
    let interval

    $effect(() => {
        if (!canvas) return
        canvas.getContext("2d").putImageData(blurData, 0, 0)
    })

    onMount(async () => {
        if (interval) clearInterval(interval)
        interval = setInterval(() => {
            time = new Date()
            if (!$newsStore) {
                newsFetch()
            }
        }, cOffline)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<a id="banner" href={$newsStore ? $newsStore[0]["link"] : ""}>
    <div id="banner-date">
        <h2>{formatOrdinalNumber(time.getDate())}</h2>
        <div id="banner-date-month">
            <h4>of</h4>
            <h3>{time.toLocaleString("en-us", {month: "long"})}</h3>
        </div>
    </div>
    <div id="banner-news">
        <h4>NEWS:</h4>
        <span>{$newsStore ? $newsStore[0]["title"] : ""}</span>
    </div>
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
    }

    #banner::after, #banner::before {
        content: '';
        position: absolute;
        background-image: conic-gradient(from var(--angle), var(--pink), var(--purple), var(--pink));
        z-index: -1;
        inset: -1px;
        border-radius: var(--border);
        animation: 3s spin linear infinite;
        transition: opacity 0.5s;
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
        display: flex;
        justify-content: start;
        gap: 5px;
    }

    #banner-date h2 {
        font-size: 40px;
        line-height: 34px;
        color: var(--white);
    }

    #banner-date-month {
        display: flex;
        flex-direction: column;
        align-items: start;
        height: 34px;
    }

    #banner-date-month h3 {
        color: var(--snow);
    }

    #banner-date-month h4 {
        color: var(--silver);
        font-size: 10px;
        line-height: 10px;
        height: 16px;
        align-content: end;
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
        color: var(--silver);
        font-size: 15px;
        line-height: 18px;
    }

    #banner-news span {
        white-space: nowrap;
        color: var(--silver);
        font-size: 15px;
        line-height: 18px;
        overflow: hidden;
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