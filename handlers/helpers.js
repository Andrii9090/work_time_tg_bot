
const formatDate = (dateItem, isMonth = false) => {
    if (isMonth) {
        dateItem += 1
    }
    if (dateItem > 9) {
        return dateItem;
    } else {
        return `0${dateItem}`
    }
}

exports.getDateStr = (date) => {
    return `${date.getFullYear()}-${formatDate(date.getMonth(), true)}-${formatDate(date.getDate())}`
}

exports.formatDate = formatDate