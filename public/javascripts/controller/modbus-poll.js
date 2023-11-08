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
    blr1: {
        timestamp: null,
        data: null,
        params: null
    },
    blr2: {
        timestamp: null,
        data: null,
        params: null
    },
    blr3: {
        timestamp: null,
        data: null,
        params: null
    },
    blr4: {
        timestamp: null,
        data: null,
        params: null
    },
    t5: {
        timestamp: null,
        data: null,
        params: null
    }
}

async function mainModbusPoll(server) {

    const m340 = require('../utils/m340read');
    const logIt = require('../utils/logger');

    const bits = require('../utils/bit-operations');
    bits.addBinFunctions();
    console.log(c.PLC_IPS);
    console.log(c.BLR4);
    console.log(c.T5);

    const io = require('socket.io')(server
        // , {
        // cors: {
        //     origin: '*'
        // }
        // }
    )
    io.on('connection', (socket) => {
        socket.emit('message', 'You are connected!');
        socket.on('little_newbie', function (username) {
            socket.username = username;
        });
        socket.on('message', function (message) {
            console.log(socket.username + ' sent a message! They\'re saying: ' + message);
        });
    })
    io.sockets.on('broadcast', function (socket, username) {
        socket.broadcast.emit('alldata', JSON.stringify(global.maindata));

    });


    const getDateTimeStringCurrent = require('../utils/get-last-day').getDateTimeStringCurrent

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
    async function pollPlc(_client, startMW, countMW) {
        const data = await _client.readHoldingRegisters(startMW, countMW)
        const floats = m340.getFloatsFromMOdbusCoils(data.data);
        return floats
    }


    let handler = setInterval(async function () {

        try {
            const _floats = await pollPlc(client4, c.CURRENT_START_MW[c.BLR4], 2 * (c.M340_VARIABLES_QUANTITY[c.BLR4] + c.M340_VARIABLES_QUANTITY[c.BLR4_2]))
            _floats.forEach((fl, i) => {
                maindata.blr4.data[i] = fl
            });

            maindata.blr4.timestamp = getDateTimeStringCurrent((new Date()).toISOString())
        } catch (error) {
            console.log(" clients[c.BLR4]  readHoldingRegisters ERROR", error);
            maindata.blr4.data = maindata.blr4.data.map(i => null);
        }

        try {
            const _floats = await pollPlc(client5, c.CURRENT_START_MW[c.T5], 2 * c.M340_VARIABLES_QUANTITY[c.T5])
            _floats.forEach((fl, i) => {
                maindata.t5.data[i] = fl
            });

            maindata.t5.timestamp = getDateTimeStringCurrent((new Date()).toISOString())
        } catch (error) {
            console.log(" clients[c.T5]  readHoldingRegisters ERROR", error);
            maindata.t5.data = maindata.t5.data.map(i => null);
        }


        try {
            const _floats = await pollPlc(client5, c.CURRENT_START_MW[c.T5] + 2 * c.M340_VARIABLES_QUANTITY[c.T5], 2 * c.M340_VARIABLES_QUANTITY[c.T5_2])
            _floats.forEach((fl, i) => {
                maindata.t5.data[i + c.M340_VARIABLES_QUANTITY[c.T5]] = fl
            });

            maindata.t5.timestamp = getDateTimeStringCurrent((new Date()).toISOString())
        } catch (error) {
            console.log(" clients[c.T5_2]  readHoldingRegisters ERROR", error);
            maindata.t5.data = maindata.t5.data.map(i => null);
        }

        io.sockets.emit('broadcast', JSON.stringify(global.maindata));
        // console.log("maindatat- ", maindata);
    }, c.DATA_COLLECT_PERIOD);
}

module.exports = mainModbusPoll;