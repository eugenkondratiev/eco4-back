const router = require('express').Router();

/* GET users listing. */

router.get('/:blr', async function (req, res, next) {
    const {
        year = 2023,
        month = 11,
        day = 16
    } = req.query;

    const _blr = req.params.blr
    const _hour = _blr == "el" ? 0 : 7

    try {
        const answer = await require('../public/javascripts/controller/day-report')({
            blr: _blr,
            year: year,
            month: month,
            day: day,
            hour: _hour
        })
        console.log("DAY answer", answer.data, maindata[_blr].params, _blr);
        // console.log("DAY answer", answer.data, maindata[_blr == "el" ? "t5" : _blr].params, _blr);

        answer.data ?
            res.send({
                params: maindata[_blr].params,
                // params: maindata[_blr == "el" ? "t5" : _blr].params,
                ...answer
            }) :
            res.send(answer)
    } catch (error) {
        console.log("day route error ", error);
        res.send('respond with a error ');

    } finally {

    }
});

module.exports = router;