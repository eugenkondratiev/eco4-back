const router = require('express').Router();

/* GET users listing. */
router.patch("/:blr", (req, res, next) => {
    const _blr = req.params.blr
    console.log("###PATCH", _blr);
    try {
        const response = "PATCH IN TODO LIST"

        res.status(200).send(JSON.stringify(response))
    } catch (error) {
        res.status(500).send(JSON.stringify({
            error: error,
            msg: 'PATCH  error '
        }));
    }

})

router.get('/:blr', async function (req, res, next) {
    const {
        year = 2023,
            month = 11,
    } = req.query;

    const _blr = req.params.blr
    const _hour = _blr == "el" ? 0 : 7
    try {
        const answer = await require('../public/javascripts/controller/month-report')({
            blr: _blr,
            year: year,
            month: month,
            hour: _hour
        })
        console.log("MONTH answer", answer);
        answer.data ?
            res.send({
                params: maindata[_blr == "el" ? "t5" : _blr].params,
                ...answer
            }) :
            res.send(answer)
    } catch (error) {
        console.log("month route error ", error);
        res.status(500).send(JSON.stringify({
            error: error,
            msg: 'respond with a error '
        }));

    } finally {

    }
});

module.exports = router;