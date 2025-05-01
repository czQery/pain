export const overrideOV = {
	"Atoms": [
		{
			"HourId": 2,
			"GroupIds": "#",
			"RoomId": "",
			"SubjectId": "67",
			"TeacherId": "#",
			"Change": null
		},
		{
			"HourId": 3,
			"GroupIds": "#",
			"RoomId": "",
			"SubjectId": "67",
			"TeacherId": "#",
			"Change": null
		}
	],
	"Hours": [
		{
			"BeginTime": "6:00",
			"Caption": "1/2",
			"EndTime": "9:30",
			"Id": 2
		},
		{
			"BeginTime": "10:00",
			"Caption": "2/2",
			"EndTime": "13:20",
			"Id": 3
		}
	]
}

export const overrideRooms = {
	"R3": {
		"ignore":
			["TV", "CAD", "AJ"],
		"rooms":
			[
				[4, 4, 0, 0, 0], // odd
				[1, 1, 1, 2, 4] // even
			]
	}
}

export const overrideMasters = {
	"UJ01Z": 101, // Lí
	"UW035": 201, // Sla
	"UY03K": 202, // Št
	"U0014": 204, // Mi
	"UX03D": 211, // Zí
	"UV02Z": 302, // Šm
	"UY03L": 303, // Du
	"UW033": 306, // Da
	"UW034": 306  //No
}

export const overrideCanteen = {
	"UJ01Z": [
		["7:50", "7:40", "7:30", "7:30", "7:20"],
		[null, "9:20", "9:10", "8:20", null]
	],
	"UW035": [
		["8:50", "8:10", "8:20", "8:20", "7:40"],
		["7:40", null, "8:00", "9:00", "8:50"]
	],
	"UY03L": [
		["7:30", "7:20", "9:20", "9:00", "9:00"],
		["8:30", "8:10", "8:10", "8:00", "7:50"]
	],
	"UV02Z": [
		["9:00", "8:20", "9:10", "8:30", "7:50"],
		["7:50", "7:30", "8:50", "8:10", "7:40"]
	],
	"UX03D": [
		["9:20", "7:50", "8:00", "7:40", "7:30"],
		["7:30", "9:10", "9:00", "8:50", "8:30"]
	],
	"UW033": [
		["7:20", "9:10", "9:00", "8:40", "8:30"],
		["8:10", "7:50", "7:40", "7:30", "8:00"]
	],
	"U0014": [
		[null, null, null, "8:10", "8:00"],
		[null, null, null, null, null]
	],
	"UY03K": [
		["9:10", "8:30", "8:50", "8:00", "8:10"],
		["9:20", "8:00", "8:20", "8:40", "9:00"]
	],
	"UW034": [
		["8:40", "8:40", "8:30", null, "8:20"],
		["8:00", "7:40", "7:20", "9:20", "9:10"]
	]
}

export const overrideOVGroup = {
	"764": [
		[null, null, null, null, null],
		[null, null, null, null, null]
	],
	"ZGY21K": [ // R3-EM3-OV4
		[null, null, "UV02Z", "UV02Z", "UX03D"], // odd
		[null, null, null, null, null] // even 4->1->2->3
	],
	"ZGW1WS": [ // R3-EM2-OV3
		[null, null, "UW035", "UW033", "UW034"], // odd
		[null, null, null, null, null] // even 3->4->1->2
	],
	"RGW1X6": [ // R3-EM1-OV2
		[null, null, "UJ01Z", "UX03D", "U0014"], // odd
		[null, null, null, null, null] // even 2->3->4->1
	]
}

export const overrideWeek = (week) => {
	return week % 2 ? "1" : "2"
}