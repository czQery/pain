importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js")

const CACHE = "offline"

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting()
    }
})

workbox.navigationPreload.enable()
workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.NetworkFirst({
        cacheName: CACHE,
        networkTimeoutSeconds: 1,
        matchOptions: {
            ignoreVary: true
        },
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 12,
                maxEntries: 100,
                purgeOnQuotaError: true,
            }),
        ],
    })
)