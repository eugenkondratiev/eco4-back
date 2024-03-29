const {
    dbQuery: dbQuery1
} = require('./db');
const {
    dbQuery: dbQuery2
} = require('./db2');


const {
    getLocalDateTimeString
} = require('../utils/get-last-day');
const getNiceMonth = (month) => {
    return month > 9 ? "" + month : "0" + month;
}

const EL_REPORT_PARAMS = require('../utils/constants').EL_REPORT_PARAMETERS

const getDayReportSql = ({
    table,
    day,
    blr
}) => {
    const reportParams = blr == "el" ? EL_REPORT_PARAMS : " * "

    return `SELECT ${reportParams} FROM ${table} where dt between '${day}' and DATE_ADD('${day}', INTERVAL 23 hour);`;

}

const monthDatesSql = ({
    table,
    month,
    year,
    hour = 7
}) => {
    const _hour = hour == 23 ? 0 : hour + 1
    const mm = getNiceMonth(month);
    return `select distinct DATE_ADD(DATE(dt), INTERVAL ${_hour} hour) as dtm  from ${table} where month(dt) ='${mm}' and year(dt) = '${year}' `; //order by dt asc` ; 
}

module.exports = async (
    blr,
    month, year, hour = 7
) => {
    // const _dataTable = blr === "blr4" ? "`eco4`.`hours`" : "`t5`.`hours5`"
    const _dataTable = require('../utils/blrtable')(blr)

    const daysSql = monthDatesSql({
        table: _dataTable,
        month,
        year,
        hour
    })

    const dbQuery = blr == "blr2" ? dbQuery2 : dbQuery1;

    const _hour = hour == 23 ? 0 : hour + 1

    let resp
    try {
        ;
        // const _sql = `SELECT * from ${dataTable} where dt>'${getLocalDateTimeString(_dateRange.start)}' AND dt<='${getLocalDateTimeString(_dateRange.end)}';`
        // console.log("sql dayreaport", _sql);
        const daysList = (await dbQuery(daysSql)).rows.map(dt => getLocalDateTimeString(dt[0]));
        // console.log("answer ", answer[3]);
        const monthData = []
        const blrparams = []
        maindata[blr].params.forEach(({
            // maindata[blr == "el" ? "t5" : blr].params.forEach(({
            index,
            ...restparam
        }, paramIndex) => {
            blrparams[paramIndex] = {
                ...restparam
            }
        })
        // console.log("blrparams", blrparams);
        // console.log("blrparams", blrparams[59]);
        // console.log("blrparams", blrparams[60]);
        // console.log("blrparams", blrparams[61]);

        for (const day of daysList) {

            try {

                const daySql = getDayReportSql({
                    table: _dataTable,
                    day,
                    blr
                })

                const dayData = (await dbQuery(daySql)).rows.map(([id, _date, ...rest]) => {
                    return [getLocalDateTimeString(_date), ...rest]
                })
                const hourRecordsQantity = dayData.length;
                const niceHour = _hour == 0 ? ' 00:00:00' :
                    ` ${_hour < 10? "0":""}${hour}:00:00`;

                const dayRow = [day.replace(
                    // ' 08:00:00',
                    niceHour,
                    hourRecordsQantity === 24 ? "" : `&${hourRecordsQantity}`)]

                dayData.forEach(([_dt, ...hourRecord], index) => {
                    // console.log("dayData.forEach", index, hourRecord);   
                    if (!index) {
                        hourRecord.forEach((value, valueIndex) => {
                            // console.log("blrparams[valueIndex + 1]", valueIndex, blrparams[valueIndex + 1]);
                            if (blrparams[valueIndex].type == 0) {
                                dayRow[valueIndex + 1] = value / hourRecordsQantity
                            } else {
                                dayRow[valueIndex + 1] = value
                            }
                        })
                        return
                    }

                    hourRecord.forEach((value, valueIndex) => {
                        if (blrparams[valueIndex].type == 0) {
                            dayRow[valueIndex + 1] += value / hourRecordsQantity
                            return
                        }

                        if (blrparams[valueIndex].type == 1) {
                            dayRow[valueIndex + 1] += value
                            return
                        }

                        if (blrparams[valueIndex].type == 2) {
                            if (value && value > dayRow[valueIndex + 1]) dayRow[valueIndex + 1] = value
                            return
                        }

                        if (blrparams[valueIndex].type == 3) {
                            if (value && value < dayRow[valueIndex + 1]) dayRow[valueIndex + 1] = value
                            return
                        }

                    })

                })
                monthData.push(dayRow)
                // console.log("DQY DATA", day, dayRow);

            } catch (error) {
                console.log("DAY OF MONTH GET error", error);
            }
        }
        resp = daysList.length ? {
                blr: blr,
                data: monthData
            }
            // {
            //     blr: blr,
            //     data: answer.map(([id, _date, ...rest]) => {
            //         return [getLocalDateTimeString(_date), ...rest]
            //     })
            // } 
            :
            {
                blr: blr,
                data: null
            }
        return resp
    } catch (error) {
        resp = {
            blr,
            data: null,
            error: error
        }
        console.log(" get month data error ", error);
        return resp
    }
    // finally {
    //     return resp
    // }

}