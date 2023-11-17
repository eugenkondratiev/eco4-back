const {
    getDayString
} = require("../utils/get-last-day")

module.exports = async ({
    blr = "blr4",
    year = 2023,
    month = 11,
    day = 16
}) => {

    const _params = [...maindata[blr].params]
    const _date = getDayString({
        year,
        month,
        day
    })

    console.log("month-report", _date);
    return
}