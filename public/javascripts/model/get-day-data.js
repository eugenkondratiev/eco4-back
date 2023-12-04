const {
    dbQuery
} = require('./db');

const {
    getLocalDateTimeString
} = require('../utils/get-last-day');

module.exports = async (
    blr,
    _dateRange
) => {
        const dataTable = require('../utils/blrtable')(blr)

    let resp
    try {
        ;
        const _sql = `SELECT * from ${dataTable} where dt>'${getLocalDateTimeString(_dateRange.start)}' AND dt<='${getLocalDateTimeString(_dateRange.end)}';`
        // console.log("sql dayreaport", _sql);
        const answer = (await dbQuery(_sql)).rows;
        // console.log("answer ", answer[3]);
        resp = answer.length ? {
            blr: blr,
            data: answer.map(([id, _date, ...rest]) => {
                return [getLocalDateTimeString(_date), ...rest]
            })
        } : {
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