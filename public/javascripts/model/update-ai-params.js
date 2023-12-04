const dbQuery = require('./db').dbQuery;

const formParamObject = ([id, _index, _tag, _eu, _format, type, _caption]) => {
    return {
        index: _index,
        tag: _tag,
        eu: _eu,
        format: _format,
        type,
        caption: _caption
    }
}
module.exports = async function () {
    let params4
    let params5
    let params1


    try {

        params1 = (await dbQuery('SELECT * FROM eco2.paramseco1;')).rows || [];

        // console.log("params1 - ", params1 || []);
    } catch (error) {
        console.log("params4 error - ", error);
        params1 = []

    }


    try {

        params4 = (await dbQuery('SELECT * FROM eco4.paramseco4;')).rows || [];

        // console.log("params4 - ", params4 || []);
    } catch (error) {
        console.log("params4 error - ", error);
        params4 = []

    }

    try {

        params5 = (await dbQuery('SELECT * FROM t5.paramseco5;')).rows || [];
        // console.log("params5 - ", params5);
    } catch (error) {
        console.log("params5 error - ", error);
        params5 = []
    }



    return {
        prm4: params4.map(formParamObject),
        prm5: params5.map(formParamObject),
        prm1: params1.map(formParamObject)
    }

}