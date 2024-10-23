export const overrideOV = {
    "Atoms": [
        {
            "HourId": 2,
            "GroupIds": "#",
            "SubjectId": "67",
            "TeacherId": "UY03K"
        },
        {
            "HourId": 3,
            "GroupIds": "#",
            "SubjectId": "67",
            "TeacherId": "UY03K"
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
    "Sla": 201,
    "Št": 202,
    "Zí": 211,
    "Šm": 302,
    "Du": 303,
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