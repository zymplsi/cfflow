var _ = require('underscore');
var js2xmlparser = require("./js2xmlparser");
var DOMParser = require('xmldom').DOMParser;
var fs = require('fs');
var parser = require('libxml-to-js');



var s = {

    "system": {
        "@": {
            name: "SPECIAL",
            ip: "192.168.1.77",
            port: "2345",
            protocol: "tcp",
            alwayson: "1",
            offlinequeue: "0",
            accept: "0",
            acceptBroadcasts: "0",
            ssl: "0",
            maxconnections: "0",
            heartbeatRx: "",
            heartbeatTx: "",
            heartbeatMode: "-1",
            eom: "",
            connectionStatus: "0"
        },
        "fb": {

            "@": {
                name: "SPECIAL_feedbacks",
                regex: "(?msi)(.*)"
            }
        }
    }
};

// var new_systems = js2xmlparser("systems", s, {
//     declaration: {
//         include: false
//     }
// });

fs.readFile('./NDC.gui', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    // var doc = new DOMParser().parseFromString(data);
    // var systems = doc.documentElement.getElementsByTagName("systems");
    // _.each(systems, function(value, key, systems) {
    //     // console.log(key + ": " + value);
    // })


    parser(data, function(error, result) {
        if (error) {
            console.error(error);
        } else {
            // console.log(result.themes.theme[0]);

            var themes = result.themes.theme;
            _.each(themes, function(el, idx, themes) {
                el["#"] = "<![CDATA[" + el["#"] + "]]>";
            });

            // console.log(result);
            var xml = (js2xmlparser("gui", result));

            fs.writeFile("./NDC_update.gui", xml, function(err) {
                if (err)
                    throw err;
                console.log("It\'s saved");
            });


        }
    });


});
