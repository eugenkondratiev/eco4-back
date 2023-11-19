const router = require('express').Router();

/* GET users listing. */

router.get('/:blr', async function (req, res, next) {
    const {
        year = 2023,
            month = 11,
            day = 16
    } = req.query;

    const _blr = req.params.blr

    try {
        const answer = await require('../public/javascripts/controller/day-report')({
            blr: _blr,
            year: year,
            month: month,
            day: day
        })
        console.log("DAY answer", answer, answer.data);
        answer.data ?
            res.send({
                params: maindata[_blr].params,
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