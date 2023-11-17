const router = require('express').Router();

/* GET users listing. */
router.get('/:blr', async function (req, res, next) {
    const {
        year = 2023,
            month = 11,
            day = 16
    } = req.query;



    try {
        const answer = await require('../public/javascripts/controller/day-report')({
            blr: req.params.blr,
            year: year,
            month: month,
            day: day
        })
        res.send('respond with a resource  --------');
    } catch (error) {
        console.log("day route error ", error);
        res.send('respond with a error ');

    } finally {

    }
});

module.exports = router;