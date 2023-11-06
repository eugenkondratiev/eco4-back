const { EventEmitter } = require('events');
const getDateTimeStringCurrent = require('../utils/get-last-day').getDateTimeStringCurrent
const HourReportHandler = require('../model/hour-report-handler');

//========================================================
//================Report manager=======================
//========================================================
class ReportsManager extends EventEmitter {
    constructor(_parametersArray, variablesQuantity) {

        super()
        this.timestamp = null
        this.data = [...Array(variablesQuantity)];
        this.params = Array.isArray(_parametersArray) ? [..._parametersArray] : []

        this.reportHander = new HourReportHandler()

        this.on('newsecond', (newPV) => {
            ;
        })

        this.on('newhour', () => {
            ;
        })


    }

    updateData(_newdata, start = 0) {
        if (!Array.isArray(_newdata)) return
        if (!this.data) { this.setData(_newdata); return }

        _newdata.forEach((value, i) => {
            this.data[start + i] = value
        })
        this.setTimestamp()

    }


    setData(_newdata) {
        if (!Array.isArray(_newdata)) return
        this.data = [..._newdata]
        this.setTimestamp()
    }

    getData() {
        return this.data
    }

    setTimestamp() {
        this.timestamp = getDateTimeStringCurrent((new Date()).toISOString())
    }
    getTimestamp() {
        return this.timestamp
    }


}


module.exports = ReportsManager
