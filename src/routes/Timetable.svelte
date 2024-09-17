<script>
    import {timetableFetch, timetablePermanentStore, timetableStore} from "../lib/timetable.js"
    import {formatRemovedSubject, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"
    import {LucideArrowBigLeftDash, LucideArrowBigRightDash, LucidePencil, LucideTriangleAlert} from "lucide-svelte"
    import Loading from "../components/Loading.svelte"

    const hours = 9
    const subjectChange = " > "

    let time = new Date()
    let interval

    let windowHeight = 0
    let cornerHeight = 0
    let navHeight = 40
    let footerHeight = 50

    let page = 0
    const maxPage = 3

    const setPage = async (a) => {
        switch (a) {
            case "backward":
                --page
                break
            case "forward":
                ++page
                break
        }

        timetableStore.set(null)
        await timetableFetch(page)
    }

    onMount(() => {
        timetableFetch(page)
        setInterval(() => {
            time = new Date()
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
    })
</script>


<svelte:window bind:innerHeight={windowHeight}/>
{#if $timetablePermanentStore}
    {@const pageTimeStart=new Date(new Date().setDate((time.getDate() - time.getDay() + 1) + page * 7))}
    {@const pageTimeEnd=new Date(new Date().setDate(pageTimeStart.getDate() + 4))}
    <nav>
        <button on:click={() => setPage("backward")} disabled="{page === 0}">
            <LucideArrowBigLeftDash/>
        </button>
        <h3 style="width:125px;text-align:center">{pageTimeStart.getDate() + "-" + pageTimeEnd.getDate() + "." + (pageTimeStart.getMonth() + 1) + "." + pageTimeEnd.getFullYear()}</h3>
        <button on:click={() => setPage("forward")} disabled="{page === maxPage}">
            <LucideArrowBigRightDash/>
        </button>
    </nav>
{/if}
{#if $timetableStore && $timetablePermanentStore}
    <table>
        <tr>
            <th class="slim" bind:offsetHeight={cornerHeight}>
                <h3>{$timetableStore["Cycles"][0]["Abbrev"] === "S" ? "EVEN" : "ODD"}</h3>
            </th>
            <th><h3>MON</h3></th>
            <th><h3>TUE</h3></th>
            <th><h3>WED</h3></th>
            <th><h3>THU</h3></th>
            <th><h3>FRI</h3></th>
        </tr>
        {#each $timetableStore["Hours"].slice(0, hours) as hour, i}
            {@const atomHeight=Math.round((((windowHeight - footerHeight - navHeight - cornerHeight) / hours) + Number.EPSILON) * 10) / 10} <!--round the number because different browsers use different precision - the epsilon trick is not perfect but whatever -->
            <tr style="height:{atomHeight}px">
                <th class="slim">
                    <h2>{hour["Caption"]}</h2>
                    <span>{hour["BeginTime"] + "-" + hour["EndTime"]}</span>
                </th>
                {#each Array(5) as _, j}
                    <!--check if day is in past or day is today but the hour is in the past-->
                    {@const past=((j + 1 < time.getDay() || (j + 1 === time.getDay() && time.getTime() > formatTime(hour).getTime() - 1)) && page === 0) ? "subject-past" : ""}
                    {@const atom=$timetableStore["Days"][j]["Atoms"].find(t => t["HourId"] === hour["Id"])}
                    {#if atom && atom["SubjectId"]}
                        {@const group=$timetableStore["Groups"].find(s => s["Id"] === atom["GroupIds"][0])["Abbrev"].replace(" ", "").replace($timetableStore["Classes"][0]["Abbrev"], "")}
                        {@const room=$timetableStore["Rooms"].find(s => s["Id"] === atom["RoomId"])["Abbrev"]}
                        {@const subject=$timetableStore["Subjects"].find(s => s["Id"] === atom["SubjectId"])["Abbrev"].toUpperCase()}
                        {@const subjectOriginal=
                            atom["Change"] && atom["Change"]["ChangeType"] === "Added" ?
                                ($timetablePermanentStore["Subjects"].find(s => s["Id"] ===
                                    ($timetablePermanentStore["Days"][j]["Atoms"].find(t => {
                                        return t["HourId"] === atom["HourId"] && t["CycleIds"][0] === atom["CycleIds"][0]
                                    })?.["SubjectId"] ?? "")
                                )?.["Abbrev"].toUpperCase() ?? "#") + subjectChange
                                : ""
                        }
                        {@const teacher=$timetableStore["Teachers"].find(s => s["Id"] === atom["TeacherId"])["Abbrev"]}
                        <td style="background-color:var(--subject-{subject})" class={past}>
                            <div class="flex-atom" style="height:{atomHeight-10}px"> <!--making the div 10px shorter instead of using padding 5px, idk dont ask me tables behave like shit-->
                                <div class="flex-between">
                                    <span>{group}</span>
                                    <span>{room}</span>
                                </div>
                                <h3>{(subjectOriginal !== subject + subjectChange ? subjectOriginal : "") + subject}</h3> <!--2*5px padding + 2*10px span + 18px h3 and the -1px magic number xd-->
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
    nav {
        display: flex;
        width: 100vw;
        height: 40px;
        justify-content: space-evenly;
        align-items: center;
    }

    nav button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background: none;
        margin: 0;
        padding: 0;
        width: 40px;
        height: 40px;
    }

    nav :global(svg) {
        height: 25px;
        width: 25px;
    }

    table {
        display: block;
        border-collapse: collapse;
        overflow-x: auto;
        overflow-y: clip;
        max-width: 100%;
        border-left: 1px var(--silver) solid; /*.slim border*/
    }

    tr th, tr td {
        min-width: 100px;
        width: 200px;
        user-select: none;
    }

    tr .slim {
        min-width: 80px;
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
        padding: 0;
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

    .flex-atom {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 5px;
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
    }
</style>