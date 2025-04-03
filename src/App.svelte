<script>
    import {active, link} from "@dvcol/svelte-simple-router/router"
    import {RouterContext, RouterView} from "@dvcol/svelte-simple-router/components"
    import {LucideCalendarRange, LucideClock, LucideSettings, LucideUtensilsCrossed} from "lucide-svelte"
    import {timetableGroups, timetableGroupStore, timetablePermanentFetch, timetablePermanentStore} from "./lib/timetable.js"
    import {preload} from "./lib/preload.js"
    import {onMount} from "svelte"
    import Settings from "./routes/Settings.svelte"
    import Countdown from "./routes/Countdown.svelte"
    import Timetable from "./routes/Timetable.svelte"
    import Canteen from "./routes/Canteen.svelte"
    import {umami} from "./lib/umami.js"
    import {cOffline} from "./lib/const.js"

    let viewAnimate = $state(false)
    let interval

    let navDone = () => undefined
    const navStart = () => {
        navDone()?.()

        if (!document.startViewTransition) return
        viewAnimate = true

        const {promise: navStarting, resolve: navDoneInternal} = Promise.withResolvers()
        navDone = navDoneInternal

        const {promise: viewStarting, resolve: viewDone} = Promise.withResolvers()
        document.startViewTransition(async () => {
            viewDone()
            await navStarting
        })
        return viewStarting
    }

    const navEnd = () => {
        navDone()?.()
        setTimeout(async () => {
            viewAnimate = false
        }, 200)
    }

    onMount(() => {
        if (interval) clearInterval(interval)
        document.getElementById("init-loading").style.display = "none"
        document.getElementById("app").style.display = "flex"

        let group = localStorage.getItem("group")
        if (group && timetableGroups.some(g => g["id"] === group)) {
            timetableGroupStore.set(group)
        } else {
            timetableGroupStore.set(timetableGroups[0]["id"])
            localStorage.setItem("group", timetableGroups[0]["id"])
        }

        preload($timetableGroupStore.toString())
        umami($timetableGroupStore.toString())

        interval = setInterval(() => {
            if (!$timetablePermanentStore) {
                timetablePermanentFetch($timetableGroupStore.toString())
            } else {
                clearInterval(interval)
            }
        }, cOffline)
    })

    const routes = [
        {
            name: "countdown",
            path: "/countdown",
            component: Countdown
        },
        {
            name: "timetable",
            path: "/timetable",
            component: Timetable
        },
        {
            name: "canteen",
            path: "/canteen",
            component: Canteen
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
    <main class="container" style="view-transition-name:{(viewAnimate) ? 'app' : 'none'};">
        <RouterView onChange={
        async () => {
            return navStart()
        }} onError={
        () => {
            navEnd()
        }} onLoaded={
        () => {
            navEnd()
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
    ::view-transition-group(app) {
        animation-duration: 150ms;
    }

    ::view-transition-old(app) {
        animation: 50ms linear both fade-out;
    }

    ::view-transition-new(app) {
        animation: 100ms cubic-bezier(1.000, 0.700, 1.000, 1.000) 50ms both fade-in;
    }

    main {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        height: calc(100svh - 50px);
        overflow: hidden;

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

    footer {
        height: 50px;
        width: 100%;
        user-select: none;
        outline: 1px var(--gray) solid;
        z-index: 20;
        background-color: var(--black);
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
        height: 24px;
        stroke: var(--white);
        margin: 13px 0;
        display: block;
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