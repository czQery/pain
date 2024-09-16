<script>
    import {timetablePermanentStore, timetableStore} from "../lib/timetable.js"
    import {formatRemovedSubject, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"
    import {LucidePencil, LucideTriangleAlert} from "lucide-svelte"
    import Loading from "../components/Loading.svelte"

    const hours = 9
    const subjectChange = " > "

    let time = new Date()
    let interval

    let windowHeight = 0
    let cornerHeight = 0
    let footerHeight = 50

    let timetable = null
    let timetablePermanent = null
    timetableStore.subscribe(async value => {
        if (value) timetable = value
    })
    timetablePermanentStore.subscribe(async value => {
        if (value) timetablePermanent = value
    })

    onMount(() => {
        setInterval(() => {
            time = new Date()
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>


<svelte:window bind:innerHeight={windowHeight}/>
{#if timetable && timetablePermanent}
    <table>
        <tr>
            <th class="slim" bind:offsetHeight={cornerHeight}>
                <h2>{timetable["Cycles"][0]["Abbrev"] === "S" ? "EVEN" : "ODD"}</h2>
            </th>
            <th><h2>MON</h2></th>
            <th><h2>TUE</h2></th>
            <th><h2>WED</h2></th>
            <th><h2>THU</h2></th>
            <th><h2>FRI</h2></th>
        </tr>
        {#each timetable["Hours"].slice(0, hours) as hour, i}
            <tr style="height:{(windowHeight-footerHeight-cornerHeight-1) / hours}px"> <!--the 1px is for border idk don't ask me-->
                <th class="slim">
                    <h2>{hour["Caption"]}</h2>
                    <span>{hour["BeginTime"] + "-" + hour["EndTime"]}</span>
                </th>
                {#each Array(5) as _, j}
                    <!--check if day is in past or day is today but the hour is in the past-->
                    {@const past=(j + 1 < time.getDay() || j + 1 === time.getDay() && time.getTime() > formatTime(hour).getTime() - 1) ? "subject-past" : ""}
                    {@const atom=timetable["Days"][j]["Atoms"].find(t => t["HourId"] === hour["Id"])}
                    {#if atom && atom["SubjectId"]}
                        {@const group=timetable["Groups"].find(s => s["Id"] === atom["GroupIds"][0])["Abbrev"].replace(" ", "").replace(timetable["Groups"][0]["Abbrev"], "")}
                        {@const room=timetable["Rooms"].find(s => s["Id"] === atom["RoomId"])["Abbrev"]}
                        {@const subject=timetable["Subjects"].find(s => s["Id"] === atom["SubjectId"])["Abbrev"].toUpperCase()}
                        {@const subjectOriginal=
                            atom["Change"] && atom["Change"]["ChangeType"] === "Added" ?
                                (timetablePermanent["Subjects"].find(s => s["Id"] ===
                                    (timetablePermanent["Days"][j]["Atoms"].find(t => {
                                        return t["HourId"] === atom["HourId"] && t["CycleIds"][0] === atom["CycleIds"][0]
                                    })?.["SubjectId"] ?? "")
                                )?.["Abbrev"].toUpperCase() ?? "#") + subjectChange
                                : ""
                        }
                        {@const teacher=timetable["Teachers"].find(s => s["Id"] === atom["TeacherId"])["Abbrev"]}
                        <td style="background-color:var(--subject-{subject})" class={past}>
                            <div class="flex-between">
                                <span>{group}</span>
                                <span>{room}</span>
                            </div>
                            <h3 style="margin:{(((windowHeight-footerHeight-cornerHeight-1) / hours)-20-18-10)/2 - 1}px 0">{(subjectOriginal !== subject + subjectChange ? subjectOriginal : "") + subject}</h3> <!--2*5px padding + 2*10px span + 18px h3 and the -1px is another magic fucking number-->
                            <div class="flex-between">
                                <span>
                                    {#if atom["Change"]}
                                        {#if subjectOriginal.includes("#")}
                                            <LucideTriangleAlert/>
                                        {:else}
                                            <LucidePencil/>
                                        {/if}
                                        {:else}
                                        <svg></svg>
                                    {/if}
                                </span>
                                <span>{teacher}</span>
                                <span><svg></svg></span>
                            </div>
                        </td>
                    {:else if atom && atom["Change"]["ChangeType"] === "Removed"}
                        <td class={"subject-removed "+past}>
                            <span></span>
                            <h3>{formatRemovedSubject(atom["Change"]["Description"])}</h3>
                            <span>removed</span>
                        </td>
                    {:else}
                        <td></td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </table>
{:else}
    <Loading/>
{/if}

<style>
    table {
        display: block;
        border-collapse: collapse;
        overflow-x: auto;
        overflow-y: clip;
        border-left: 1px var(--silver) solid; /*.slim border*/
    }

    tr th, tr td {
        min-width: 100px;
        width: 200px;
        user-select: none;
    }

    tr .slim {
        min-width: 50px;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        background-color: var(--black);
        z-index: 10;
        border: none;
        border-top: 1px var(--silver) solid; /*.slim border*/
        border-bottom: 1px var(--silver) solid; /*.slim border*/
        border-right: 1px var(--silver) solid; /*.slim border*/
    }

    td, th {
        text-align: center;
    }

    td {
        border: 1px var(--gray) solid;
        font-weight: normal;
        padding: 5px;
    }

    th {
        border: 1px var(--silver) solid;
        padding: 10px;
        font-weight: bold;
    }

    td :global(svg) {
        height: 10px;
        width: 10px;
        stroke-width: 3px; /*default is 2px*/
    }

    .subject-past {
        filter: brightness(0.4);
    }

    .subject-removed {
        background: repeating-linear-gradient(
                45deg,
                var(--black),
                var(--black) 10px,
                rgba(255, 255, 255, 0.2) 10px,
                rgba(255, 255, 255, 0.2) 20px
        );
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
    }
</style>