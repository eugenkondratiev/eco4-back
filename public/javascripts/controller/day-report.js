const {
    getDayString,
    getDayStartEndTime,
    getLocalDateTimeString
} = require("../utils/get-last-day")

module.exports = async ({
    blr = "blr4",
    year = 2023,
    month = 11,
    day = 16
}) => {

    // const _params = [...maindata[blr].params]

    const timerange = getDayStartEndTime({
        year,
        month,
        day
    });

    let resp
    try {
        // console.log("day-report  data", blr,            timerange);
        resp = await require('../model/get-day-data')(
            blr,
            timerange
        )
        // console.log("day-report resp", resp);

    } catch (error) {
        console.log("dayreport error", error);
        resp = null
    } finally {
        return resp
    }
}