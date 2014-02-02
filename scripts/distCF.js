var _ = require('underscore');
var js2xmlparser = require("./js2xmlparser");
var fs = require('fs');
var xml2ObjParser = require('libxml-to-js');



module.exports = function(args) {

    var regex1 = /[a-zA-Z0-9]+.gui/;
    if (!args.match(regex1))
        throw new Error("invalid filename");

    var path = require('path');
    // var guiFilePath = path.resolve(__dirname, '..', 'dist', args);
    var regex2 = /(?:\w+|\d+)(?=.gui$)/;
    var guiFile = regex2.exec(args) + "_build.gui";
    var guiFilePath = path.resolve(__dirname, '..', 'build', guiFile);
    var systemFile = regex2.exec(args) + "_systems.json";
    var systemFilePath = path.resolve(__dirname, '..', 'build', systemFile);

    var newGuiFilePath = path.resolve(__dirname, '..', 'dist', args);

    fs.readFile(guiFilePath, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        xml2ObjParser(data, function(error, result) {
            if (error) {
                console.error(error);
            } else {

                fs.readFile(systemFilePath, 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }

                    // external remote systems
                    result.systems.system = JSON.parse(data);

                    // gui themes
                    var themes = result.themes.theme;

                    // reformat CDATA for proper parsing
                    _.each(themes, function(el, idx, themes) {
                        el["#"] = "<![CDATA[" + el["#"] + "]]>";
                    });

                    // generate xml .gui and write to file    
                    var xml = (js2xmlparser("gui", result));
                    fs.writeFile(newGuiFilePath, xml, function(err) {
                        if (err)
                            throw err;
                        console.log("gui is saved");
                    });


                });
            }
        });
    });

};
