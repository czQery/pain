export const overrideOV = {
    "Atoms": [
        {
            "HourId": 2,
            "GroupIds": "#",
            "RoomId": "",
            "SubjectId": "67",
            "TeacherId": "#"
        },
        {
            "HourId": 3,
            "GroupIds": "#",
            "RoomId": "",
            "SubjectId": "67",
            "TeacherId": "#"
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

export const overrideMasters = {
    "UJ01Z": 101,
    "UW035": 201,
    "UY03K": 202,
    "U0014": 204,
    "UX03D": 211,
    "UV02Z": 302,
    "UY03L": 303,
    "UW033": 306,
}

export const overrideRooms = {
    "R3": {
        "ignore":
            ["TV", "CAD", "AJ"],
        "rooms":
            [
                [4, 4, 0, 0, 0], // odd
                [1, 1, 1, 2, 4], // even
            ]
    }
}

export const overrideOVGroup = {
    "ZGY21K": [
        [null, null, "UJ01Z", "UX03D", "U0014"], // odd
        [null, null, null, null, null], // even
    ],
    "ZGW1WS": [
        [null, null, "UY03L", "UY03L", "UY03K"], // odd
        [null, null, null, null, null], // even
    ],
    "RGW1X6": [
        [null, null, "UV02Z", "UV02Z", "UX03D"], // odd
        [null, null, null, null, null], // even
    ]
}

export const overrideWeek = (week) => {
    return week % 2 ? "1" : "2"
}