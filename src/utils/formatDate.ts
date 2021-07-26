export const formatDate = (date: string) => {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const dateObj = new Date(date)
  const month = monthNames[dateObj.getMonth()]
  const day = String(dateObj.getDate()).padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  return {date: `${day} ${month} ${year}`, time: `${hours}:${minutes}`}
}

export const formatYYMMDD = (date: any) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }

  return [year, month, day].join('-')
}
