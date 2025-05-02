export const formatDay = (date) => {
	const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return week[date.getDay()]
}

export const formatDate = (date) => {
	return date.getDate().toString() + "." + (date.getMonth() + 1).toString() + "." + date.getFullYear().toString()
}

export const formatTime = (hour) => {
	let split = hour.split(":")
	let date = new Date()
	date.setHours(Number(split[0]))
	date.setMinutes(Number(split[1]))
	date.setSeconds(0)
	date.setMilliseconds(0)
	return date
}

export const formatAddZero = (num) => {
	switch (num.length) {
		case 0:
			return "00"
		case 1:
			return ("0" + num)
		default:
			return num
	}
}

export const formatCapitalize = (text) => {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatOrdinalNumber = (n) => {
	let s = ["th", "st", "nd", "rd"]
	let v = n % 100
	return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export const formatHTML = (text) => {
	const parser = new DOMParser()
	const doc = parser.parseFromString(text, "text/html")
	return doc.body.textContent
}