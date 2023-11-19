function getLastDayString() {
    const lastDay = (new Date(new Date() - 24 * 3600000));
    return lastDay.toLocaleString("ru-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).slice(0, 10);
}

function getCurrentDayString() {
    return (new Date()).toLocaleString().slice(0, 10);
}

function getDateTimeStringCurrent(dt) {
    return (new Date((new Date((new Date(new Date(dt))).toISOString())).getTime() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');
}

function getHourString(_lastDay) {
    // console.log(_lastDay);

    return _hour => {
        return `${_lastDay} ${_hour > 9 ? _hour : "0" + _hour}:00:00`
    }
}

function getDayString({
    year = 2023,
    month = 11,
    day = 16
}) {
    // console.log(_lastDay);


    return `${year<2000 ? year<2010?"200"+year :"20"+year : year}-${month > 9 ? month : "0" + month}-${day > 9 ? day : "0" + day}`

}

function getDayStartEndTime({
    year = 2023,
    month = 11,
    day = 16
}) {
    // console.log(_lastDay);

    const _dt = new Date(year, month - 1, day)
    _dt.setTime(_dt.getTime() + 7 * 3600000)
    const end = new Date(_dt)
    end.setDate(end.getDate() + 1)
    const resp = {
        start: _dt,
        end: end
    }
    console.log("getDayStartEndTime", resp);
    return resp

}


const getLastDayHourString = getHourString(getLastDayString());
const getCurrentDayHourString = getHourString(getCurrentDayString());

function getCurrentLocalDateTime() {
    const currentDateTime = new Date();
    return currentDateTime.toLocaleString("ru-UA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }) + " " +
        currentDateTime.toLocaleTimeString("ru-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

function getLocalDateTimeString(_dt) {
    // const currentDateTime = new Date();
    return _dt.toLocaleString("ru-UA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).split(".").reverse().join("-") + " " +
        _dt.toLocaleTimeString("ru-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

module.exports = {
    getLastDayHourString: getLastDayHourString,
    getLastDayString: getLastDayString,
    getCurrentDayHourString: getCurrentDayHourString,
    getCurrentLocalDateTime: getCurrentLocalDateTime,
    getDateTimeStringCurrent: getDateTimeStringCurrent,
    getDayString: getDayString,
    getDayStartEndTime: getDayStartEndTime,
    getLocalDateTimeString: getLocalDateTimeString
}