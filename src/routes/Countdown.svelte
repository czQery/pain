<script>
    import {timetableFetch, timetableStore} from "../lib/timetable.js"
    import Loading from "../components/Loading.svelte"
    import {formatAddZero, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"
    import {overrideOV} from "../lib/override.js";

    let time = new Date()
    let interval
    let overridden = false

    const getH = (hour) => formatAddZero(Math.trunc((formatTime(hour).getTime() - time) / 1000 / 3600).toString())
    const getM = (hour) => formatAddZero(Math.trunc((((formatTime(hour).getTime() - time) / 1000) % 3600) / 60).toString())
    const getS = (hour) => formatAddZero(Math.trunc(((formatTime(hour).getTime() - time) / 1000) % 60).toString())

    const setOverride = (value) => {
        if (value && value["Days"][time.getDay() - 1] && value["Days"][time.getDay() - 1]["Atoms"][0]?.["SubjectId"] === "67") {
            let edit = value
            edit["Days"][time.getDay() - 1]["Atoms"] = overrideOV["Atoms"]
            edit["Hours"] = overrideOV["Hours"]
            timetableStore.set(edit)
            overridden = true
        }
    }

    let timetableUnsubscribe = timetableStore.subscribe((value) => {
        if (!overridden) setOverride(value)
    })

    onMount(async () => {
        overridden = false
        await timetableFetch(0)
        interval = setInterval(() => {
            time = new Date()
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
        timetableUnsubscribe()
        timetableStore.set(null)
    })
</script>

{#if $timetableStore}
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

    {@const atom=today ? today["Atoms"].find(t => t["HourId"] === hour?.["Id"] ?? "#") : null}
    {@const atomNext=today ? today["Atoms"].find(t => t["HourId"] === hourNext?.["Id"] ?? "#") : null}
    {@const subject=$timetableStore["Subjects"].find(s => s["Id"] === (atom?.["SubjectId"] ?? (atomNext?.["SubjectId"] ?? "#")))?.["Abbrev"].toUpperCase() ?? "#"}
    {@const teacher=$timetableStore["Teachers"].find(s => s["Id"] === (atom?.["TeacherId"] ?? (atomNext?.["TeacherId"] ?? "#")))?.["Abbrev"] ?? ""}

    {@const hourH=(hour ? getH(hour["EndTime"]) : getH(hourNext?.["BeginTime"] ?? "00"))}
    {@const hourM=(hour ? getM(hour["EndTime"]) : getM(hourNext?.["BeginTime"] ?? "00"))}
    {@const hourS=(hour ? getS(hour["EndTime"]) : getS(hourNext?.["BeginTime"] ?? "00"))}
    <div id="countdown-block">
        <div></div>
        <div id="countdown-center">
            <div id="countdown-clock">
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
            <span>{hour?.["Caption"] + " - " + atom?.["SubjectId"]}</span>
            <span>{hourNext?.["Caption"] + " - " + atomNext?.["SubjectId"]}</span>-->
        </div>
        <div id="countdown-footer">
            <div>
                <span>Created by</span>
                <a href="https://qery.cz/l/g_pain">Štěpán Aubrecht</a>
            </div>
            <span>build: {__CF_PAGES_COMMIT_SHA__ ? "#" + __CF_PAGES_COMMIT_SHA__.slice(0, 7) : "dev"}</span> <!--injected variable by cloudflare-->
        </div>
    </div>
{:else}
    <Loading/>
{/if}

<style>
    #countdown-block {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-between;
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
    }

    #countdown-footer {
        display: flex;
        padding: 10px;
        align-items: end;
        justify-content: space-between;
    }

    #countdown-footer span, #countdown-footer a {
        font-size: 15px;
        line-height: 15px;
        text-decoration: none;
        color: var(--snow);
    }

    #countdown-footer a {
        background: linear-gradient(145deg, var(--pink) 0%, var(--purple) 100%);
        color: transparent;
        background-clip: text;
    }
</style>