const { EventEmitter } = require('events');

//========================================================
//================HOur report handler=====================
//========================================================

class HourReportHandler extends EventEmitter {
    constructor() {
        super()


    }

    updateHourData(hoursList) {
        ;
    }

    getHourData(day, hh) {
        return null
    }

    getMOnthdata(year, month) {
        return null
    }

}

module.exports = HourReportHandler