<script>
    import {timetableFetch, timetableGroups, timetableGroupStore, timetablePermanentStore, timetableStore} from "../lib/timetable.svelte.js"
    import Loading from "../components/Loading.svelte"
    import {formatAddZero, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"
    import {cOffline, cRefresh} from "../lib/const.js"
    import Sparticles from "sparticles"
    import {overrideWeek} from "../lib/override.js"
    import {getWeek} from "../lib/helper.js"

    let sparticles = {
        "composition": "source-over",
        "count": 60,
        "speed": 1,
        "parallax": 20,
        "direction": 190,
        "xVariance": 5,
        "yVariance": 5,
        "rotate": true,
        "rotation": 0.9,
        "alphaSpeed": 0,
        "alphaVariance": 2,
        "minAlpha": 0.4,
        "maxAlpha": 1,
        "minSize": 2,
        "maxSize": 12,
        "style": "fill",
        "bounce": false,
        "drift": 2,
        "glow": 10,
        "twinkle": false,
        "color": ["#8f8f8f"],
        "shape": "circle",
        "imageUrl": ""
    }

    const addSparticles = (node) => {
        new Sparticles(node, sparticles)
    }

    let animate = $state("false")
    let time = $state(new Date())

    // svelte-ignore state_referenced_locally
    let refresh = time.getTime() + cOffline // cOffline run is set always for the next request after the data is already loaded anyway
    let interval

    const getH = (hour) => formatAddZero(Math.trunc((formatTime(hour).getTime() - time) / 1000 / 3600).toString())
    const getM = (hour) => formatAddZero(Math.trunc((((formatTime(hour).getTime() - time) / 1000) % 3600) / 60).toString())
    const getS = (hour) => formatAddZero(Math.trunc(((formatTime(hour).getTime() - time) / 1000) % 60).toString())

    onMount(async () => {
        await timetableFetch($timetableGroupStore, 0, "countdown")

        setTimeout(async () => {
            if (animate) animate = "true"
        }, 500) // yeah, it's stupid but if it works who cares, it's just an animation

        if (interval) clearInterval(interval)
        interval = setInterval(() => {
            time = new Date()

            if (time.getTime() > refresh) {
                timetableFetch($timetableGroupStore, 0, "countdown")
                if (!$timetableStore) {
                    refresh = time.getTime() + cOffline
                } else {
                    refresh = time.getTime() + cRefresh
                }
            }
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
        timetableStore.set(null)
    })
</script>

{#if $timetableStore && $timetablePermanentStore}
    {@const today = $timetableStore["Days"]?.[time.getDay() - 1] ?? null}
    {@const atomBegin=today ? today?.["Atoms"].find(s => s["SubjectId"]) : null}

    {@const hour=$timetableStore["Hours"].find(t => {
        let hourBegin = formatTime(t["BeginTime"])
        let hourEnd = formatTime(t["EndTime"])
        return time - hourBegin >= 0 && hourEnd - time >= 0 && today?.["Atoms"].find(s => s["HourId"] === t["Id"] && s["SubjectId"]) // check if current hour has atom else use hourNext
    })}
    {@const hourNext=$timetableStore["Hours"].find(t => {
        let hourBegin = formatTime(t["BeginTime"])
        return hourBegin - time >= 0 && today?.["Atoms"].find(s => s["HourId"] === t["Id"] && s["SubjectId"]) && t["Id"] >= (atomBegin?.["HourId"] ?? 0)
    })}

    {@const atomOriginal=$timetablePermanentStore["Days"][time.getDay() - 1]?.["Atoms"].find(t => {
        return t["HourId"] === (hour?.["Id"] ?? "#") && t["CycleIds"]?.includes($timetableStore["Cycles"][0]?.["Id"] ?? overrideWeek(getWeek(time)))
    })}
    {@const atomOriginalNext=$timetablePermanentStore["Days"][time.getDay() - 1]?.["Atoms"].find(t => {
        return t["HourId"] === (hourNext?.["Id"] ?? "#") && t["CycleIds"]?.includes($timetableStore["Cycles"][0]?.["Id"] ?? overrideWeek(getWeek(time)))
    })}

    {@const atom=(today?.["Atoms"].find(t => t["HourId"] === (hour?.["Id"] ?? "#") && (t["Change"] === null || t["SubjectId"] !== (atomOriginal?.["SubjectId"] ?? "#") || t["TeacherId"] !== (atomOriginal?.["TeacherId"] ?? "#") || t["RoomId"] !== (atomOriginal?.["RoomId"] ?? "#"))) ?? null)}
    {@const atomNext=(today?.["Atoms"].find(t => t["HourId"] === (hourNext?.["Id"] ?? "#") && (t["Change"] === null || t["SubjectId"] !== (atomOriginalNext?.["SubjectId"] ?? "#") || t["TeacherId"] !== (atomOriginalNext?.["TeacherId"] ?? "#") || t["RoomId"] !== (atomOriginal?.["RoomId"] ?? "#"))) ?? null)}

    {@const subject=$timetableStore["Subjects"].find(s => s["Id"] === (atom?.["SubjectId"] ?? (atomNext?.["SubjectId"] ?? "#")))?.["Abbrev"].toUpperCase() ?? "#"}
    {@const teacher=$timetablePermanentStore["Teachers"].find(s => s["Id"] === (atom?.["TeacherId"] ?? (atomNext?.["TeacherId"] ?? "#")))?.["Abbrev"] ?? $timetableStore["Teachers"].find(s => s["Id"] === (atom?.["TeacherId"] ?? (atomNext?.["TeacherId"] ?? "#")))?.["Abbrev"] ?? ""}

    {@const hourH=(hour ? getH(hour["EndTime"]) : getH(hourNext?.["BeginTime"] ?? "00"))}
    {@const hourM=(hour ? getM(hour["EndTime"]) : getM(hourNext?.["BeginTime"] ?? "00"))}
    {@const hourS=(hour ? getS(hour["EndTime"]) : getS(hourNext?.["BeginTime"] ?? "00"))}
    <div id="countdown-block" use:addSparticles>
        <div style="display:block;height:56px"></div>
        <div id="countdown-center">
            <div id="countdown-clock" data-animate={animate}>
                {#if subject !== "#" && hourH !== "00"}
                    {#key hourH}
                        <h1>{hourH}</h1>
                    {/key}
                    <h1 style="color:var(--silver)">:</h1>
                {/if}
                {#if subject !== "#"}
                    {#key hourM}
                        <h1>{hourM}</h1>
                    {/key}
                {:else}
                    <h1>00</h1>
                {/if}
                <h1 style="color:var(--silver)">:</h1>
                {#if subject !== "#"}
                    {#key hourS}
                        <h1>{hourS}</h1>
                    {/key}
                {:else}
                    <h1>00</h1>
                {/if}
            </div>
            {#if !hour && subject !== "#"}
                {#if hourNext?.["Id"] === atomBegin?.["HourId"]}
                    <h2 style="color:var(--snow)">starting with</h2>
                {:else}
                    <h2 style="color:var(--snow)">break followed by</h2>
                {/if}
            {/if}
            <h2 style="color:var(--subject-{(subject !== '#' ? subject : 'NON')})">{subject !== "#" ? ("#" + (hour?.["Caption"] ?? hourNext["Caption"]) + " - " + subject) : "painless"}</h2>
            {#if subject !== "#"}
                <h4 style="color:var(--silver)">{teacher}</h4>
            {/if}
            <!--DEBUG
            <span>{subject}</span>
            <span>{"HOUR - " +hour?.["Caption"] + " - " + atom?.["SubjectId"]}</span>
            <span>{"NEXT - " +hourNext?.["Caption"] + " - " + atomNext?.["SubjectId"]}</span>-->
        </div>
        <div id="countdown-footer">
            <div>
                <span>Created by</span>
                <a href="https://qery.cz/l/g_pain">Štěpán Aubrecht</a>
            </div>
            <div style="text-align: right">
                <span>build: {__CF_PAGES_COMMIT_SHA__ ? "#" + __CF_PAGES_COMMIT_SHA__.slice(0, 7) : "dev"}</span> <!--injected variable by cloudflare-->
                <span>group: {timetableGroups.find(g => g["id"] === $timetableGroupStore)?.["name"]}</span>
            </div>
        </div>
    </div>
{:else}
    <Loading/>
{/if}

<style>
    #countdown-block :global(.sparticles) {
        position: absolute;
        width: 100%;
        height: calc(100svh - 50px);
    }

    #countdown-block {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-between;
    }

    #countdown-center, #countdown-footer {
        z-index: 10;
    }

    #countdown-center {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #countdown-clock {
        display: flex;
        justify-content: center;
        user-select: none;
    }

    #countdown-clock * {
        animation: var(--animation-scale);
        will-change: transform;
    }

    #countdown-clock[data-animate="false"] * {
        animation-duration: 0s !important;
    }

    #countdown-footer {
        display: flex;
        padding: 10px;
        height: 56px;
        align-items: end;
        justify-content: space-between;
    }

    #countdown-footer div {
        height: 36px;
        display: flex;
        flex-direction: column;
    }

    #countdown-footer span, #countdown-footer a {
        font-size: 15px;
        line-height: 18px;
        display: inline-block;
        text-decoration: none;
        color: var(--snow);
    }

    #countdown-footer a {
        background: var(--brand);
        color: transparent;
        background-clip: text;
    }
</style>