const connectPLC = require('./connect-plc');

const TcpPort = require("modbus-serial").TcpPort;
const ModbusRTU = require("modbus-serial");
const c = require('../utils/constants');
const tcpPort4 = new TcpPort(c.PLC_IPS[c.BLR4]);
const tcpPort5 = new TcpPort(c.PLC_IPS[c.T5]);

// console.log("tcpPorts  - ", tcpPorts);

const client4 = new ModbusRTU(tcpPort4);
const client5 = new ModbusRTU(tcpPort5);

global.maindata = {
    blr1: { timestamp: null, data: null, params: null },
    blr2: { timestamp: null, data: null, params: null },
    blr3: { timestamp: null, data: null, params: null },
    blr4: { timestamp: null, data: null, params: null },
    t5: { timestamp: null, data: null, params: null }
}

async function mainModbusPoll() {

    const m340 = require('../utils/m340read');
    const logIt = require('../utils/logger');

    const bits = require('../utils/bit-operations');
    bits.addBinFunctions();
    console.log(c.PLC_IPS);
    console.log(c.BLR4);
    console.log(c.T5);

    try {
        const retBLR4 = await connectPLC(client4, c.BLR4)
        console.log("retBLR4 - ", retBLR4);

    } catch (error) {
        logIt("connect PLC4 error" + error.message)
    }

    try {

        const retT5 = await connectPLC(client5, c.T5)
        console.log("retT5 - ", retT5);
    } catch (error) {
        logIt("connect PLC5 error" + error.message)

    }


    maindata.blr4.data = [...Array(c.M340_VARIABLES_QUANTITY[c.BLR4] + c.M340_VARIABLES_QUANTITY[c.BLR4_2])];
    maindata.t5.data = [...Array(c.M340_VARIABLES_QUANTITY[c.T5])];
    console.log("c.M340_VARIABLES_QUANTITY[c.BLR4]+c.M340_VARIABLES_QUANTITY[c.BLR4_2]  ", c.M340_VARIABLES_QUANTITY[c.BLR4], c.M340_VARIABLES_QUANTITY[c.BLR4_2]);

    let handler = setInterval(function () {
        //PromiseAPI
        //client4.readHoldingRegisters(12150, 120)//c.M340_VARIABLES_QUANTITY[c.BLR4+c.BLR4_2])
        client4.readHoldingRegisters(c.CURRENT_START_MW[c.BLR4], 2 * (c.M340_VARIABLES_QUANTITY[c.BLR4] + c.M340_VARIABLES_QUANTITY[c.BLR4_2]))
            .then(data => {

                const _answer = data.data;
                const floats = m340.getFloatsFromMOdbusCoils(_answer);
                // const floats = m340.getFloatsFromMOdbusCoils(_answer.slice(0, c.M340_VARIABLES_QUANTITY[c.BLR4 + c.BLR4_2]));

                console.log(" clients[c.BLR4]  test");

                floats.forEach((fl, i) => {
                    maindata.blr4.data[i] = fl
                });
                // INT_DATA.forEach(i => {
                //     dataBlr4[i] = _answer[i + c.M340_VARIABLES_QUANTITY[c.BLR4]];
                // })

                //    console.log("dataBlr4 - ", maindata.blr4.data);
            })
            .catch(err => {
                console.log(" clients[c.BLR4]  readHoldingRegisters ERROR", err);
                maindata.blr4.data = maindata.blr4.data.map(i => null);
            })


        client5.readHoldingRegisters(c.CURRENT_START_MW[c.T5], 2 * c.M340_VARIABLES_QUANTITY[c.T5])
            .then(data => {

                const _answer = data.data;
                // console.log("T5 raw data", data.data);
                const floats = m340.getFloatsFromMOdbusCoils(_answer);

                console.log(" clients[c.T5]  test");

                floats.forEach((fl, i) => {
                    maindata.t5.data[i] = fl
                });
                // console.log("datat5 - ", maindata.t5.data);
            })
            .catch(err => {
                console.log(" clients[c.t5]  readHoldingRegisters ERROR", err);
                maindata.t5.data = maindata.t5.data.map(i => null);
            });

        client5.readHoldingRegisters(c.CURRENT_START_MW[c.T5] + 2 * c.M340_VARIABLES_QUANTITY[c.T5], 2 * c.M340_VARIABLES_QUANTITY[c.T5_2])
            .then(data => {

                const _answer = data.data;
                console.log("T5 raw data  2", data.data);
                const floats = m340.getFloatsFromMOdbusCoils(_answer);

                console.log(" clients[c.T5_2]  test");

                floats.forEach((fl, i) => {
                    maindata.t5.data[i + c.M340_VARIABLES_QUANTITY[c.T5]] = fl
                });
                console.log("maindatat- ", maindata);
            })
            .catch(err => {
                console.log(" clients[c.t5]  readHoldingRegisters ERROR", err);
                // maindata.t5.data = maindata.t5.data.map(i => null);
            });
    }, c.DATA_COLLECT_PERIOD);
}

module.exports = mainModbusPoll;