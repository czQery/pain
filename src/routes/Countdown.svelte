<script>
    import {timetableFetch, timetableStore} from "../lib/timetable.js"
    import Loading from "../components/Loading.svelte"
    import {formatAddZero, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"

    let time = new Date()
    let interval

    const getM = (hour) => {
        return formatAddZero(Math.trunc((formatTime(hour).getTime() - time) / (1000 * 60)).toString())
    }

    const getS = (hour) => {
        return formatAddZero(Math.trunc(((formatTime(hour).getTime() - time) / 1000) % 60).toString())
    }

    onMount(() => {
        timetableFetch(0)
        interval = setInterval(() => {
            time = new Date()
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

{#if $timetableStore}
    {@const hour=$timetableStore["Hours"].find(t => {
        let hourBegin = formatTime(t["BeginTime"])
        let hourEnd = formatTime(t["EndTime"])
        return time - hourBegin >= 0 && hourEnd - time >= 0
    })}
    {@const hourNext=$timetableStore["Hours"].find(t => {
        let hourEnd = formatTime(t["EndTime"])
        return hourEnd - time >= 0
    })}
    {@const atom=$timetableStore["Days"][time.getDay() - 1]["Atoms"].find(t => t["HourId"] === hour?.["Id"] ?? "#")}
    {@const atomNext=$timetableStore["Days"][time.getDay() - 1]["Atoms"].find(t => t["HourId"] === hourNext?.["Id"] ?? "#")}
    {@const subject=$timetableStore["Subjects"].find(s => s["Id"] === (atom ? atom["SubjectId"] : (atomNext ? atomNext["SubjectId"] : "#")))?.["Abbrev"].toUpperCase() ?? "#"}
    {@const teacher=$timetableStore["Teachers"].find(s => s["Id"] === (atom ? atom["TeacherId"] : (atomNext ? atomNext["TeacherId"] : "#")))?.["Abbrev"] ?? ""}
    <div id="countdown-block">
        <div></div>
        <div id="countdown-center">
            <div id="countdown-clock">
                <h1>{subject !== "#" ? (hour ? getM(hour["EndTime"]) : getM(hourNext["BeginTime"])) : "00"}</h1>
                <h1 style="color:var(--silver)">:</h1>
                <h1>{subject !== "#" ? (hour ? getS(hour["EndTime"]) : getS(hourNext["BeginTime"])) : "00"}</h1>
            </div>
            {#if !hour && subject !== "#"}
                <h2 style="color:var(--snow)">break followed by</h2>
            {/if}
            <h2 style="color:var(--subject-{(subject !== '#' ? subject : 'NON')})">{subject !== "#" ? ("#" + (hour ? hour["Caption"] : hourNext["Caption"]) + " - " + subject) : "painless"}</h2>
            {#if subject !== "#"}
                <h4 style="color:var(--silver)">{teacher}</h4>
            {/if}
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