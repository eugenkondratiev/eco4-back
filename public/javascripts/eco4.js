$(function () {

    function getAiRow(ai, prefix = "Eco4") {
        // const tr = document.createElement('tr');
        // $('<td>' , { text: name }).appendTo(tr);
        // $('<td>' , { text: ai.description }).appendTo(tr);
        // $('<td>' , { text: ai.units }).appendTo(tr);
        // $('<td>' , { id : name,  text: 'NaN' }).appendTo(tr);
        // return tr;
        return $('<tr>', {
            append: $('<td>', {
                    text: ai.tag
                })
                .add($('<td>', {
                    text: ai.caption,
                    "class": "aiLabel"
                }))
                .add($('<td>', {
                    text: ai.eu
                }))
                .add($('<td>', {
                    id: `${prefix}_${ai.tag}`,
                    text: 'NaN',
                    "class": "value"
                }))
        })
    };

    const socket = io.connect('http://192.168.1.188:3005');
    // const socket = io.connect('http://178.158.238.89:3000');
    const username = "testuser";
    socket.emit('little_newbie', username);
    socket.on('message', function (message) {
        console.log('The server has a message for you: ' + message);
    });

    console.log("start");
    socket.on('broadcast', message => {
        // console.log("broadcast ", message);
        const data = JSON.parse(message)
        console.log(data);

        // $('#testDiv').text(JSON.stringify(data.blr4, null, " "));

        if ($('#Eco4_P236').length != 0) {
            // $('#testDiv').text(JSON.stringify(data.blr4, null, " "));
            console.log("$('#Eco4_P236').length", $('#Eco4_P236').length);

            try {
                data.blr4.params.forEach(el => {
                    const elName = "#Eco4_" + el.tag;
                    const _value = data.blr4.data[el.index - 1]
                    const _newdata = isFinite(Number(_value)) ? _value.toFixed(3) : "NaN"
                    $(elName).text(_newdata);
                });
                $("#last-data-timestamp").text("Обновлено : " + data.blr4.timestamp);
            } catch (error) {
                console.log("error data update", error);
            }

            try {
                data.t5.params.forEach(el => {
                    const elName = "#T5_" + el.tag;
                    const _value = data.t5.data[el.index - 1]
                    const _newdata = isFinite(Number(_value)) ? _value.toFixed(3) : "NaN"
                    $(elName).text(_newdata);
                });
                $("#last-data-timestamp5").text("Обновлено : " + data.t5.timestamp);
            } catch (error) {
                console.log("error data update T5", error);
            }


        } else {
            ;
            data.blr4.params.forEach((ai, i) => {
                console.log(ai.tag, ai);
                $('#dataEco4').append(getAiRow(ai, "Eco4"));

            })
            data.t5.params.forEach((ai, i) => {
                console.log(ai.tag, ai);
                $('#dataT5').append(getAiRow(ai, "T5"));

            })


        }



    })

    socket.on('alldata', message => {
        console.log("alldata ", JSON.parse(message));
    })

    // $.getJSON('data/ais.json',data => {
    //     for (ai in data.eco2) {
    //         $('#dataEco4').append(getAiRow(ai, data.eco2[ai], "Eco4"));
    //     }

    //     socket.on('newdata', function(message) {
    //         const dataM340 = JSON.parse(message.data);
    //         // console.log(data.parameters);
    //         try {
    //             data.parameters.eco2.forEach(el => {
    //                 const elName ="#Eco2_" + el;
    //                 $(elName).text(dataM340[data.eco2[el].index]);
    //             });   
    //             $("#last-data-timestamp").text("Обновлено : " + JSON.parse(message.timestamps)[1]);             
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     });
    // });
});