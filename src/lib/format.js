export const formatRemovedSubject = (description) => {
    return description.split("(").pop().split(",")[0];
}