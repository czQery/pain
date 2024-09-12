import { resolve } from "path"
import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import { browserslistToTargets } from "lightningcss"
import browserslist from "browserslist"

const root = resolve(__dirname, "src")

export default defineConfig({
    root,
    envDir: "../",
    css: {
        transformer: "lightningcss",
        lightningcss: {
            targets: browserslistToTargets(browserslist(">= 0.25%")),
        },
    },
    build: {
        cssMinify: "lightningcss",
        target: "esnext",
        outDir: "../dist",
        emptyOutDir: true,
    },
    plugins: [svelte()],
})