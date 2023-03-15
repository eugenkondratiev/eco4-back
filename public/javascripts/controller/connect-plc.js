const c = require('../utils/constants');
const { getCurrentLocalDateTime } = require('../utils/get-last-day')


function connectPLC(_client, plc = 0) {

    console.log("connsect PLCs", plc, c.PLC_IPS[plc], c.PLC_PORTS[plc]);
    return _client.connectTCP(c.PLC_IPS[plc], { port: c.PLC_PORTS[plc] })
        .then(() => {
            _client.setID(10 + plc);
            console.log(`client.setID(${10 + plc});`)
        })
        .catch((err) => {
            console.log(`PLC connection error ${getCurrentLocalDateTime()} ----  ${c.PLC_IPS[plc]}`, err.message);
            setTimeout(connectPLC(_client, plc), c.PLC_RECONNECT_DELAY)
        });

}


module.exports = connectPLC