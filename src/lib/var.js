import {writable} from "svelte/store"

export const source = {
    "gymnp.cz": [
        {"id": "ZGY21K", "name": "KVINTA", "class": "KVINTA", "src": "am"}
    ],
    "sssenp.cz": [
        {"id": "ZGY21K", "name": "R3-EM3-OV4", "class": "R3", "src": "sa"},
        {"id": "ZGW1WS", "name": "R3-EM2-OV3", "class": "R3", "src": "dk"},
        {"id": "RGW1X6", "name": "R3-EM1-OV2", "class": "R3", "src": "af"}
    ]
}

export const sourceSchoolStore = writable(null)
export const sourceGroupStore = writable(null)