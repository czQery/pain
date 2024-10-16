<script>
    import {timetableFetch, timetablePermanentStore, timetableStore} from "../lib/timetable.js"
    import {formatCapitalize, formatTime} from "../lib/format.js"
    import {onDestroy, onMount} from "svelte"
    import {LucideArrowBigLeftDash, LucideArrowBigRightDash, LucidePencil, LucideTriangleAlert} from "lucide-svelte"
    import Loading from "../components/Loading.svelte"
    import Modal from "../components/Modal.svelte"

    const hours = 9
    const subjectChange = " > "

    let modal
    let modalSubject = "#"
    let modalSubjectColor = "NON"
    let modalTeacher = "#"
    let modalTheme = "#"
    const modalShow = (subject, teacher, description) => {
        if (subject["Name"]) {
            modalSubject = subject["Name"]
            modalSubjectColor = subject["Abbrev"].toUpperCase()
        } else {
            modalSubject = subject
            modalSubjectColor = "FREE"
        }
        if (teacher) {
            modalTeacher = teacher["Name"]
        } else {
            modalTeacher = ""
        }
        modalTheme = formatCapitalize(description.replaceAll("&quot;", "\""))
        modal.show()
        return null
    }

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

    onMount(async () => {
        page = 0
        await timetableFetch(page)
        interval = setInterval(() => {
            time = new Date()
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(interval)
        timetableStore.set(null)
    })
</script>

<svelte:window bind:innerHeight={windowHeight}/>
{#if $timetablePermanentStore}
    {@const pageTimeBegin=new Date(new Date().setDate((time.getDate() - time.getDay() + 1) + page * 7))}
    {@const pageTimeEnd=new Date(new Date().setDate((time.getDate() - time.getDay() + 5) + page * 7))}
    <nav>
        <button on:click={() => setPage("backward")} disabled="{page === 0 || !$timetableStore}">
            <LucideArrowBigLeftDash/>
        </button>
        <h3 style="width:125px;text-align:center">{pageTimeBegin.getDate() + "-" + pageTimeEnd.getDate() + "." + (pageTimeEnd.getMonth() + 1) + "." + pageTimeEnd.getFullYear()}</h3>
        <button on:click={() => setPage("forward")} disabled="{page === maxPage || !$timetableStore}">
            <LucideArrowBigRightDash/>
        </button>
    </nav>
{/if}
{#if $timetableStore && $timetablePermanentStore}
    <Modal bind:modal title="Tuition details">
        {#if modalSubjectColor === "FREE"}
            <h2 style="background:var(--brand);color:transparent;background-clip:text">{modalSubject}</h2>
        {:else}
            <h2 style="color:var(--subject-{modalSubjectColor})">{modalSubject}</h2>
        {/if}
        {#if modalTeacher !== ""}
            <h3 style="color:var(--snow)">{modalTeacher}</h3>
        {/if}
        {#if modalTheme !== ""}
            <div style="height:10px"></div>
            <h3 style="color:var(--silver)">{modalTheme}</h3>
        {/if}
    </Modal>
    <table>
        <tr>
            <th class="slim" bind:offsetHeight={cornerHeight}>
                <h3>{($timetableStore["Cycles"][0]?.["Abbrev"] ?? "???") === "S" ? "EVEN" : "ODD"}</h3>
            </th>
            <th><h3>MON</h3></th>
            <th><h3>TUE</h3></th>
            <th><h3>WED</h3></th>
            <th><h3>THU</h3></th>
            <th><h3>FRI</h3></th>
        </tr>
        {#each $timetableStore["Hours"].slice(0, hours) as hour, i}
            {@const atomHeight=Math.round((((Math.max(windowHeight, 660) - footerHeight - navHeight - (cornerHeight + 1)) / hours) + Number.EPSILON) * 10) / 10} <!--round the number because different browsers use different precision - the epsilon trick is not perfect but whatever -->
            <tr style="height:{atomHeight}px">
                <th class="slim">
                    <h2>{hour["Caption"]}</h2>
                    <span>{hour["BeginTime"] + "-" + hour["EndTime"]}</span>
                </th>
                {#each Array(5) as _, j}
                    {@const day=$timetableStore["Days"][j]}
                    <!--check if day is in past or day is today but the hour is in the past-->
                    {@const past=((0 === time.getDay() || j + 1 < time.getDay() || (j + 1 === time.getDay() && time.getTime() > formatTime(hour["EndTime"]).getTime() - 1)) && page === 0) ? "subject-past" : ""}
                    {@const atom=day?.["Atoms"].find(t => t["HourId"] === hour["Id"])}
                    {#if atom}
                        {@const subjectOriginal=
                            ($timetablePermanentStore["Subjects"].find(s => s["Id"] ===
                                ($timetablePermanentStore["Days"][j]["Atoms"].find(t => {
                                    return t["HourId"] === atom["HourId"] && t["CycleIds"]?.includes($timetableStore["Cycles"][0]?.["Id"] ?? "#")
                                })?.["SubjectId"] ?? "#")
                            ) ?? null)
                        }
                        {#if day["DayType"] !== "WorkDay"} <!--special day-->
                            <td class={"subject-removed "+past} on:click={modalShow(day["DayType"], null, day["DayDescription"])}>
                                <span></span>
                                <h3>{subjectOriginal["Abbrev"].toUpperCase()}</h3>
                                <span>{day["DayType"].toLowerCase()}</span>
                            </td>
                        {:else if atom["SubjectId"]} <!--normal atom-->
                            {@const group=$timetableStore["Groups"].find(s => s["Id"] === atom["GroupIds"]?.[0] ?? "#")?.["Abbrev"].replace(" ", "").replace($timetableStore["Classes"][0]["Abbrev"], "") ?? ""}
                            {@const room=$timetableStore["Rooms"].find(s => s["Id"] === atom["RoomId"])?.["Abbrev"] ?? ""}
                            {@const subject=$timetableStore["Subjects"].find(s => s["Id"] === atom["SubjectId"]) ?? null}
                            {@const teacher=$timetableStore["Teachers"].find(s => s["Id"] === atom["TeacherId"]) ?? null}
                            <td style="background-color:var(--subject-{subject['Abbrev'].toUpperCase()})" class={past} on:click={modalShow(subject, teacher, atom["Theme"])}>
                                <div class="flex-atom" style="height:{atomHeight-10}px"> <!--making the div 10px shorter instead of using padding 5px, idk dont ask me tables behave like shit-->
                                    <div class="flex-between">
                                        <span>{group}</span>
                                        <span>{room}</span>
                                    </div>
                                    <h3>{((subjectOriginal?.["Id"] ?? "#") !== subject["Id"] ? (subjectOriginal?.["Abbrev"].toUpperCase() ?? "#") + subjectChange : "") + subject["Abbrev"].toUpperCase()}</h3> <!--2*5px padding + 2*10px span + 18px h3 and the -1px magic number xd-->
                                    <div class="flex-between">
                                <span>
                                    {#if atom["Change"]}
                                        {#if subjectOriginal}
                                            <LucidePencil/>
                                        {:else}
                                            <LucideTriangleAlert/>
                                        {/if}
                                        {:else}
                                        <svg></svg>
                                    {/if}
                                </span>
                                        <span>{teacher["Abbrev"]}</span>
                                        <span><svg></svg></span>
                                    </div>
                                </div>
                            </td>
                        {:else if atom["Change"]["ChangeType"] === "Removed" || atom["Change"]["ChangeType"] === "Canceled"} <!--atom removed-->
                            <td class={"subject-removed "+past} on:click={modalShow(atom["Change"]["ChangeType"], null, atom["Change"]["TypeName"] ?? "Unknown reason")}>
                                <span></span>
                                <h3>{subjectOriginal["Abbrev"].toUpperCase()}</h3>
                                <span>{atom["Change"]["TypeName"]?.split(" ")[0].toLowerCase() ?? "removed"}</span>
                            </td>
                        {/if}
                    {:else} <!--atom doesnt exist-->
                        <td style="cursor: default"></td>
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
        width: 100%;
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

    nav button:active :global(svg) {
        animation: var(--animation-scale);
    }

    nav :global(svg) {
        height: 25px;
        width: 25px;
        stroke: var(--white);
    }

    table {
        display: block;
        border-collapse: collapse;
        overflow-x: auto;
        overflow-y: clip;
        max-width: 100%;
        border-left: 1px var(--gray) solid; /*.slim border*/
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
        border-top: 1px var(--gray) solid; /*.slim border*/
        border-bottom: 1px var(--gray) solid; /*.slim border*/
        border-right: 1px var(--gray) solid; /*.slim border*/
    }

    td, th {
        text-align: center;
    }

    td {
        box-shadow: inset 0 0 30px 3px rgba(0, 0, 0, .2);
        border: 1px var(--gray) solid;
        font-weight: normal;
        padding: 0;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent !important;
    }

    th {
        border: 1px var(--gray) solid;
        padding: 10px;
        font-weight: bold;
    }

    td :global(svg) {
        height: 10px;
        width: 10px;
        stroke-width: 3px; /*default is 2px*/
        stroke: var(--white);
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

    @media screen and (max-height: 660px) {
        table {
            overflow-y: auto;
        }
    }
</style>