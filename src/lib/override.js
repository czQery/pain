export const overrideOV = {
    "Atoms": [
        {
            "HourId": 2,
            "GroupIds": "#",
            "SubjectId": "67",
            "TeacherId": "#"
        },
        {
            "HourId": 3,
            "GroupIds": "#",
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
    "Li":  101,
    "Sla": 201,
    "Št":  202,
    "Mi":  204,
    "Zí":  211,
    "Šm":  302,
    "Du":  303,
    "Da":  306,
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

export const overrideWeek = (week) => {
    return week % 2 ? "1" : "2"
}