export const formatDay = (date) => {
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

export const formatCapitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
