<script>
    import {onMount} from "svelte"
    import {canteenFetch, canteenStore} from "../lib/canteen.js"
    import Loading from "../components/Loading.svelte"
    import {formatDate, formatDay} from "../lib/format.js"

    onMount(async () => {
        await canteenFetch()
    })
</script>

{#if $canteenStore}
    <div id="canteen-block">
        {#each $canteenStore as day, _}
            {@const date=new Date(Number(day["date"]))}
            {@const lines=day["dish"].split(/, (?=[\p{Lu}])/u)}
            <div class="canteen-day">
                <div class="canteen-title">
                    <h2>{formatDay(date)}</h2>
                    <h3>{"- " + formatDate(date)}</h3>
                </div>
                <div class="canteen-lines">
                    {#each lines as line, i}
                        <h3 style="color:var(--{(i === lines.length-1 ? 'silver' : 'snow')})">{line}</h3>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <Loading/>
{/if}

<style>
    #canteen-block {
        display: flex;
        width: 100%;
        flex-direction: column;
        overflow-y: auto;
        padding: 20px;
        align-items: center;
        gap: 20px;
    }

    .canteen-day {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 500px;
        width: 100%;
    }

    .canteen-title {
        display: flex;
        gap: 5px;
        align-items: baseline;
    }

    .canteen-title h2 {
        background: linear-gradient(145deg, var(--pink) 0%, var(--purple) 100%);
        color: transparent;
        background-clip: text;
    }

    .canteen-title h3 {
        color: var(--silver);
    }

    .canteen-lines {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
</style>