var _ = require('underscore');
var fs = require('fs');
var xml2ObjParser = require('libxml-to-js');
var js2xmlparser = require("./js2xmlparser");


// code for use to run from node prompt
// var args = process.argv.splice(1);
// console.log(args[0] + " : " + args[1]);

// var regex = /[a-zA-Z0-9]+.gui/;
// if (!args[1].match(regex))
//     throw new Error("invalid filename");

// var path = require('path');
// var guiFilePath = path.resolve(__dirname, '..', 'build', args[1]);
// var regex = /(?:\w+|\d+)(?=.gui$)/;
// var systemFile = regex.exec(args[1]) + "_systems.json";
// var systemFilePath = path.resolve(__dirname, '..', 'build', systemFile);
// console.log(systemFilePath);

module.exports = function(args) {


    var regex1 = /[a-zA-Z0-9]+.gui/;
    if (!args.match(regex1))
        throw new Error("invalid filename");

    var path = require('path');
    var guiFilePath = path.resolve(__dirname, '..', 'dist', args);
    var regex2 = /(?:\w+|\d+)(?=.gui$)/;
    var systemFile = regex2.exec(args) + "_systems.json";
    var systemFilePath = path.resolve(__dirname, '..', 'build', systemFile);

    fs.exists(guiFilePath, function(exists) {
        if (!exists)
            throw new Error(guiFilePath + "\n" + args + " does not exist!");
    });



    try {
        console.log("processing " + guiFilePath);

        fs.readFile(guiFilePath, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            // console.log("data");
            // console.log(data);
            xml2ObjParser(data, function(error, result) {
                if (error) {
                    console.log(error);
                } else {

                    if (_.has(result, "systems")) {

                        fs.writeFile(systemFilePath, JSON.stringify(result.systems.system), function(err) {
                            if (err)
                                throw new Error("fail to write to " + systemFilePath);
                            console.log("system json saved");
                        });
                    }



                }
            });


        });


    } catch (err) {

        console.log(err);

    }

};
