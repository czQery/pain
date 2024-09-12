<script>
    import {timetableStore} from "../lib/timetable.js"

    const hours = 9

    let windowHeight = 0
    let cornerHeight = 0
    let footerHeight = 50
    let timetable = null
    timetableStore.subscribe(async value => {
        if (value) {
            timetable = value
        }
    })
</script>


<svelte:window bind:innerHeight={windowHeight}/>
<table>
    {#if timetable}
        <tr>
            <th class="slim" bind:offsetHeight={cornerHeight}>
                <h2>{timetable["Cycles"][0]["Abbrev"]}</h2>
            </th>
            <th><h2>MNO</h2></th>
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
                    {#if timetable["Days"][j]["Atoms"][i] && timetable["Days"][j]["Atoms"][i]["SubjectId"]}
                        {@const group=timetable["Groups"].find(s => s["Id"] === timetable["Days"][j]["Atoms"][i]["GroupIds"][0])["Abbrev"].replace(" ", "").replace(timetable["Groups"][0]["Abbrev"], "")}
                        {@const room=timetable["Rooms"].find(s => s["Id"] === timetable["Days"][j]["Atoms"][i]["RoomId"])["Abbrev"]}
                        {@const subject=timetable["Subjects"].find(s => s["Id"] === timetable["Days"][j]["Atoms"][i]["SubjectId"])["Abbrev"].toUpperCase()}
                        {@const teacher=timetable["Teachers"].find(s => s["Id"] === timetable["Days"][j]["Atoms"][i]["TeacherId"])["Abbrev"]}
                        <td style="background-color:var(--subject-{subject})">
                            <div class="flex-between">
                                <span>{group}</span>
                                <span>{room}</span>
                            </div>
                            <h3>{subject}</h3>
                            <span>{teacher}</span>
                        </td>
                    {:else}
                        <td></td>
                    {/if}
                {/each}
            </tr>
        {/each}
    {/if}
</table>

<style>
    table {
        display: block;
        border-collapse: collapse;
        overflow: scroll;
    }

    tr th, tr td {
        min-width: 100px;
        width: 200px;
    }

    tr .slim {
        min-width: 50px;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        background-color: var(--black);
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

    .flex-between {
        display: flex;
        justify-content: space-between;
    }
</style>