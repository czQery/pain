import App from "./App.svelte"
import {mount} from "svelte"
import {writable} from "svelte/store"

export const update = writable(false)

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", function () {
        console.log("[MAIN] - update detected")
        update.set(true)
    })
}

const app = mount(App, {
    target: document.getElementById("app")
})

export default app
