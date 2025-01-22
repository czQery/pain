importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js")

const CACHE = "offline"

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting()
    }
})

workbox.core.clientsClaim()
workbox.routing.registerRoute(
    new RegExp("/*"),
    new workbox.strategies.NetworkFirst({
        cacheName: CACHE,
        networkTimeoutSeconds: 1,
        matchOptions: {
            ignoreVary: true
        },
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                purgeOnQuotaError: true
            })
        ]
    })
)