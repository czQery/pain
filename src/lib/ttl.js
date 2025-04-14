// remove when gymnp.cz branch is merged
export const ttlSchoolPreset = () => {
    localStorage.setItem("school", "sssenp.cz")
}

// clean deprecated caches
export const ttlCleanCache = () => {
    if (!("caches" in window)) return

    let deprecated = ["offline", "app", "api"]

    caches.keys().then(list => {
        list.forEach(name => {
            if (deprecated.includes(name)) {
                console.log("[TTL] - deleting old cache:", name)
                caches.delete(name)
            }
        })
    })
}