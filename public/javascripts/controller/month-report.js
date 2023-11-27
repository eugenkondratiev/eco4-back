const {
    getDayString
} = require("../utils/get-last-day")

module.exports = async ({
    blr = "blr4",
    year = 2023,
    month = 11
}) => {

    // const _params = [...maindata[blr].params]
    // const _date = getDayString({
    //     year,
    //     month,
    //     day
    // })

    // console.log("month-report", _date);

    let resp
    try {
        // console.log("day-report  data", blr,            timerange);
        resp = await require('../model/get-month-data')(
            blr,
            month, year
        )
        // console.log("day-report resp", resp);

    } catch (error) {
        console.log("monthreport error", error);
        resp = null
    } finally {
        return resp
    }
}