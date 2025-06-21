export const getWeek = date => {
	const firstDay = new Date(date.getFullYear(), 0, 1)
	const pastDays = (date - firstDay) / 8.64e7
	return Math.ceil((pastDays + firstDay.getDay() + 1) / 7)
}

export const getNum = max => {
	return Math.floor(Math.random() * (max + 1))
}
