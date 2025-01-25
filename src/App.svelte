<script>
    import {active, link} from "@dvcol/svelte-simple-router/router"
    import {RouterContext, RouterView} from "@dvcol/svelte-simple-router/components"
    import {LucideCalendarRange, LucideClock, LucideSettings, LucideUtensilsCrossed} from "lucide-svelte"
    import {timetableFetch, timetableGroups, timetableGroupStore, timetablePermanentFetch} from "./lib/timetable.js"
    import {onMount} from "svelte"
    import Settings from "./routes/Settings.svelte"
    import {canteenFetch} from "./lib/canteen.js"

    let navDone = () => undefined
    const navStart = () => {
        if (!document.startViewTransition) return

        const {promise: navStarting, resolve: navDoneInternal} = Promise.withResolvers()
        navDone = navDoneInternal

        const {promise: viewStarting, resolve: viewDone} = Promise.withResolvers()
        document.startViewTransition(async () => {
            viewDone()
            await navStarting
        })
        return viewStarting
    }

    onMount(() => {
        document.getElementById("init-loading").style.display = "none"
        document.getElementById("app").style.display = "flex"

        let group = localStorage.getItem("group")
        if (group && timetableGroups.some(g => g["id"] === group)) {
            timetableGroupStore.set(group)
        } else {
            timetableGroupStore.set(timetableGroups[0]["id"])
            localStorage.setItem("group", timetableGroups[0]["id"])
        }

        timetablePermanentFetch($timetableGroupStore ?? "null")
    })

    const routes = [
        {
            name: "countdown",
            path: "/countdown",
            component: async () => {
                await timetableFetch($timetableGroupStore, 0, "countdown")
                return import("./routes/Countdown.svelte")
            }
        },
        {
            name: "timetable",
            path: "/timetable",
            component: async () => {
                await timetableFetch($timetableGroupStore, 0, "timetable")
                return import("./routes/Timetable.svelte")
            }
        },
        {
            name: "canteen",
            path: "/canteen",
            component: async () => {
                await canteenFetch()
                return import("./routes/Canteen.svelte")
            }
        },
        {
            name: "settings",
            path: "/settings",
            component: Settings
        },
        {
            name: "index",
            path: "*",
            redirect: {
                name: "countdown"
            }
        }
    ]

    const options = {
        routes
    }

</script>

<RouterContext {options}>
    <main class="container">
        <RouterView onChange={
        async () => {
            navDone()?.()
            return navStart()
        }} onError={
        () => {
            navDone()?.()
        }} onLoaded={
        () => {
            navDone()?.()
        }}/>
    </main>
    <footer>
        <ul>
            <li>
                <a use:link use:active href="/countdown">
                    <LucideClock/>
                </a>
            </li>
            <li>
                <a use:link use:active href="/timetable">
                    <LucideCalendarRange/>
                </a>
            </li>
            <li>
                <a use:link use:active href="/canteen">
                    <LucideUtensilsCrossed/>
                </a>
            </li>
            <li>
                <a use:link use:active href="/settings">
                    <LucideSettings/>
                </a>
            </li>
        </ul>
    </footer>
</RouterContext>

<style>
    main {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        height: calc(100svh - 50px);
        background-color: var(--black);

        --subject-NON: var(--silver);

        --subject-A: #0c355b;
        --subject-AJ: #d5334b;
        --subject-CAD: #5f6895;
        --subject-ČJL: #f2c40e;
        --subject-ČT: #dd7571;
        --subject-E: #058e3f;
        --subject-EM: #a845b3;
        --subject-ET: #11bb41;
        --subject-EK: #fa147f;
        --subject-M: #23b1d2;
        --subject-ON: #851049;
        --subject-OV: #885d4c;
        --subject-TV: #f5980c;
    }

    ::view-transition-group(app-footer) {
        animation-duration: 0s !important;
    }

    footer {
        height: 50px;
        width: 100%;
        user-select: none;
        outline: 1px var(--gray) solid;
        z-index: 20;
        background-color: var(--black);
        view-transition-name: app-footer;
    }

    footer ul {
        display: flex;
        margin: 0;
        padding: 0;
        height: 100%;
        justify-content: center;
        list-style-type: none;
        text-decoration: none;
    }

    footer :global(a) {
        text-decoration: none;
        -webkit-tap-highlight-color: transparent !important;
        outline: none !important;
        display: flex;
        justify-content: center;
        width: inherit;
    }

    footer :global(svg) {
        display: block;
        height: 40px;
        margin: 5px;
        stroke: var(--white);
    }

    footer :global(a[data-active="true"] svg) {
        stroke: var(--purple);
    }

    footer :global(a:active svg) {
        animation: var(--animation-scale);
    }

    footer ul li {
        width: 100%;
        max-width: 200px;
    }
</style>