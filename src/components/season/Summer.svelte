<script>
	import { getNum } from "../../lib/helper.js"

	/*
	converted gif to webp with looping
	ffmpeg -i 0.gif -compression_level 6 -loop 0 0.webp
	*/

	let index = getNum(4)
</script>

<div id="season-summer">
	<img alt="" src="/img/season/summer/{index}.webp" />
</div>

<style>
	#season-summer {
		position: absolute;
		width: 100%;
		height: calc(100svh - 50px);
	}

	#season-summer img {
		width: inherit;
		height: inherit;
		opacity: 0.3;
	}
</style>
