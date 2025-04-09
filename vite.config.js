import {resolve} from "path"
import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import {browserslistToTargets} from "lightningcss"
import browserslist from "browserslist"
import {VitePWA} from "vite-plugin-pwa"

const root = resolve(__dirname, "src")

export default defineConfig({
    root,
    envDir: "../",
    css: {
        transformer: "lightningcss",
        lightningcss: {
            targets: browserslistToTargets(browserslist(">= 0.25%"))
        }
    },
    server: {
        port: 8080,
        allowedHosts: true
    },
    build: {
        cssMinify: "lightningcss",
        target: "esnext",
        outDir: "../dist",
        emptyOutDir: true
    },
    define: {
        __CF_PAGES_COMMIT_SHA__: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA)
    },
    plugins: [
        svelte(),
        VitePWA({
            devOptions: {
                enabled: true
            },
            injectRegister: "inline",
            registerType: "autoUpdate",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ["**/*.{js,css,html,ico,woff2,png,svg}"],
                runtimeCaching: [
                    {
                        urlPattern: /^.*\/api\/.*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            expiration: {
                                maxEntries: 50,
                                purgeOnQuotaError: true
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            },
            manifestFilename: "site.webmanifest",
            manifest: {
                "name": "Pain",
                "description": "Better Bakaláři timetable",
                "short_name": "Pain",
                "start_url": "/",
                "id": "/",
                "lang": "en-US",
                "theme_color": "#000000",
                "display": "standalone",
                "orientation": "portrait-primary",
                "background_color": "#000000",
                "shortcuts": [],
                "prefer_related_applications": false,
                "related_applications": [],
                "categories": [
                    "utilities",
                    "productivity"
                ],
                "icons": [
                    {
                        "src": "/img/face.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "any"
                    },
                    {
                        "src": "/img/face-black.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
                "screenshots": [
                    {
                        "src": "/img/sc-countdown.png",
                        "sizes": "750x1334",
                        "type": "image/png"
                    },
                    {
                        "src": "/img/sc-timetable.png",
                        "sizes": "750x1334",
                        "type": "image/png"
                    },
                    {
                        "src": "/img/sc-countdown-wide.png",
                        "sizes": "1024x720",
                        "type": "image/png",
                        "form_factor": "wide"
                    },
                    {
                        "src": "/img/sc-timetable-wide.png",
                        "sizes": "1024x720",
                        "type": "image/png",
                        "form_factor": "wide"
                    }
                ]
            }
        })
    ]
})
