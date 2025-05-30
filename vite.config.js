import { svelte } from "@sveltejs/vite-plugin-svelte"
import browserslist from "browserslist"
import { browserslistToTargets } from "lightningcss"
import { resolve } from "path"
import { defineConfig } from "vite"
import { ViteMinifyPlugin } from "vite-plugin-minify"
import { VitePWA } from "vite-plugin-pwa"

const root = resolve(__dirname, "src")

export default defineConfig({
	root,
	envDir: "../",
	css: { transformer: "lightningcss", lightningcss: { targets: browserslistToTargets(browserslist(">= 0.25%")) } },
	server: { port: 8080, allowedHosts: true },
	build: {
		minify: "terser",
		cssMinify: "lightningcss",
		target: "esnext",
		outDir: "../dist",
		emptyOutDir: true,
		sourcemap: false,
		terserOptions: { mangle: { toplevel: true }, output: { comments: false } },
	},
	define: { __CF_PAGES_COMMIT_SHA__: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA) },
	plugins: [
		svelte(),
		ViteMinifyPlugin(),
		VitePWA({
			devOptions: { enabled: true },
			injectRegister: "inline",
			registerType: "autoUpdate",
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
				cleanupOutdatedCaches: true,
				globPatterns: ["**/*.{js,css,html,ico,txt,woff2,webp,png,svg}"],
				runtimeCaching: [{
					urlPattern: /^.*\/api\/.*/i,
					handler: "NetworkFirst",
					options: {
						cacheName: "api-cache",
						networkTimeoutSeconds: 1,
						expiration: { maxEntries: 50, purgeOnQuotaError: true },
						cacheableResponse: { statuses: [0, 200] },
					},
				}],
			},
			manifestFilename: "site.webmanifest",
			manifest: {
				name: "Pain",
				description: "Better Bakaláři timetable",
				short_name: "Pain",
				start_url: "/",
				id: "/",
				lang: "en-US",
				theme_color: "#000000",
				display: "standalone",
				orientation: "portrait-primary",
				background_color: "#000000",
				shortcuts: [],
				prefer_related_applications: false,
				related_applications: [],
				categories: ["utilities", "productivity"],
				icons: [{ src: "/img/face.png", sizes: "512x512", type: "image/png", purpose: "any" }, {
					src: "/img/face-black.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				}],
				screenshots: [
					{ src: "/img/sc/narrow-countdown.webp", sizes: "750x1334", type: "image/webp", form_factor: "narrow" },
					{ src: "/img/sc/narrow-timetable.webp", sizes: "750x1334", type: "image/webp", form_factor: "narrow" },
					{ src: "/img/sc/narrow-canteen.webp", sizes: "750x1334", type: "image/webp", form_factor: "narrow" },
					{ src: "/img/sc/wide-countdown.webp", sizes: "1920x1080", type: "image/webp", form_factor: "wide" },
					{ src: "/img/sc/wide-timetable.webp", sizes: "1920x1080", type: "image/webp", form_factor: "wide" },
					{ src: "/img/sc/wide-canteen.webp", sizes: "1920x1080", type: "image/webp", form_factor: "wide" },
				],
			},
		}),
	],
})
