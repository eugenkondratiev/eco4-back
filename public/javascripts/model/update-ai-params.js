const dbQuery = require('./db').dbQuery;

const formParamObject = ([id, _index, _tag, _eu, _format, _caption]) => {
    return {
        index: _index, tag: _tag, eu: _eu, format: _format, caption: _caption
    }
}
module.exports = async function () {
    let params4
    let params5

    try {

        params4 = (await dbQuery('SELECT * FROM eco4.paramseco4;')).rows || [];
        
        // console.log("params4 - ", params4 || []);
    } catch (error) {
        console.log("params4 error - ", error);
        params4 = []

    }

    try {

        params5 = (await dbQuery('SELECT * FROM t5.paramst5;')).rows || [];
        // console.log("params5 - ", params5);
    } catch (error) {
        console.log("params5 error - ", error);
        params5 = []
    }



    return  {prm4: params4.map(formParamObject), prm5:params5.map(formParamObject)}

}