const {
    dbQuery
} = require('./db');

const {
    getLocalDateTimeString
} = require('../utils/get-last-day');
const getNiceMonth = (month) =>{
    return month > 9 ? "" + month : "0" + month;
}
const monthDatesSql = ({
    table,
    month,
    year
}) => {
    const mm = getNiceMonth(month);
    return `select distinct DATE_ADD(DATE(dt), INTERVAL 8 hour) as dtm  from ${table} where month(dt) ='${mm}' and year(dt) = '${year}' `; //order by dt asc` ; 
}

module.exports = async (
    blr,
    month, year
) => {
    const dataTable = blr === "blr4" ? "`eco4`.`hours`" : "`t5`.`hours5`"

    const daysSql = monthDatesSql({
        dataTable,
        month,
        year
    })
    let resp
    try {
        ;
        // const _sql = `SELECT * from ${dataTable} where dt>'${getLocalDateTimeString(_dateRange.start)}' AND dt<='${getLocalDateTimeString(_dateRange.end)}';`
        // console.log("sql dayreaport", _sql);
        const answer = (await dbQuery(daysSql)).rows;
        // console.log("answer ", answer[3]);
        resp = answer.length ? {
                blr: blr,
                data: answer
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
        console.log(" get tata error ", error);
        return resp
    }
    // finally {
    //     return resp
    // }

}