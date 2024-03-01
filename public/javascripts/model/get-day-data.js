const {
    dbQuery:dbQuery1
} = require('./db');

const {
    dbQuery: dbQuery2
} = require('./db2');

const {
    getLocalDateTimeString
} = require('../utils/get-last-day');

module.exports = async (
    blr,
    _dateRange
) => {
    const dataTable = require('../utils/blrtable')(blr)
    const dbQuery = blr =="blr2" ? dbQuery2 :dbQuery1;
    const EL_REPORT_PARAMS = require('../utils/constants').EL_REPORT_PARAMETERS

    let resp
    try {
        const reportParams = blr == "el" ? EL_REPORT_PARAMS : " * "


        const _sql = `SELECT ${reportParams} from ${dataTable} where dt>'${getLocalDateTimeString(_dateRange.start)}' AND dt<='${getLocalDateTimeString(_dateRange.end)}';`
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