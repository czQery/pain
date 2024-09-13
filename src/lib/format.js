export const formatRemovedSubject = (description) => {
    return description.split("(").pop().split(",")[0];
}

export const formatTime = (hour) => {
    let split = hour["EndTime"].split(":")
    let date = new Date()
    date.setHours(Number(split[0]))
    date.setMinutes(Number(split[1]))
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}