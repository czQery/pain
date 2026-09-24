export const overrideOV = {
	Atoms: [
		{
			HourId: 2,
			GroupIds: "#",
			RoomId: "",
			SubjectId: "67",
			TeacherId: "#",
			Change: null,
		},
		{
			HourId: 3,
			GroupIds: "#",
			RoomId: "",
			SubjectId: "67",
			TeacherId: "#",
			Change: null,
		},
	],
	Hours: [
		{
			BeginTime: "6:00",
			Caption: "1/2",
			EndTime: "9:30",
			Id: 2,
		},
		{
			BeginTime: "10:00",
			Caption: "2/2",
			EndTime: "13:20",
			Id: 3,
		},
	],
}

export const overrideMasters = {
	UJ01Z: 101, // Lí
	UW035: 201, // Sla
	UY03K: 202, // Št
	U0014: 204, // Mi
	UR02L: 206, // Jo
	UX03D: 211, // Zí
	UV02Z: 302, // Šm
	UY03L: 303, // Du
	UW033: 306, // Da
	UW034: 306, // No
}

export const overrideOrdering = {
	"gymnp.cz": "https://e-jidelnicek.cz/login",
	"sssenp.cz": "https://jidelna.sssenp.cz/faces/login.jsp",
}

export const overrideCanteen = {
	/*
	UJ01Z: [
		[null, "7:40", "7:30", "7:20", "9:20"],
		[null, "9:00", "8:50", "8:40", "8:20"],
	],
	UW035: [
		["8:40", "8:10", "8:00", "7:50", "7:40"],
		[null, "8:10", "8:00", "7:50", "7:30"],
	],
	*/
}

export const overrideOVGroup = {
	"764": [
		[null, null, null, null, null],
		[null, null, null, null, null],
	],
	"ZGW1X6": [
		[null, null, null, null, "UR02L"],
		[null, "UR02L", null, null, null],
	],
}

export const overrideRooms = {
	/*
	ZGY21K: {
		rooms: [
			[
				["VT2", "4", "4", "8", "8", "3", "3", "VT2", "VT2"],
				["EM", "EM", "3", "VT1", "VT1", "12", "VT2", "EM", "EM"],
				[null, "4", "4", "12", "2", "2", "2", "VT2", null],
				[null, null, null, null, null, null, null, null, null], // OV
				[null, "3", "3", "3", "3", "TV", "TV", null, null],
			], // odd
			[
				[null, "4", "VT2", "VT2", "12", "12", "2", "2", null],
				[null, null, null, null, null, null, null, null, null], // OV
				["VT2", "VT1", "VT1", "6", "6", "VT2", "VT2", null, null],
				["VT1", "VT2", "VT2", "1", "5", "5", "VT2", "VT2", null],
				[null, "2", "2", "VT1", "2", "2", "TV", "TV", null],
			], // even
		],
	},
	*/
}

export const overrideWeek = week => {
	return week % 2 ? "1" : "2"
}
