module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'build/**/*.js', 'scripts/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },

        execute: {
            createBuild: {
                call: function(grunt, options, async) {

                    var parseCF = require('./scripts/parseCF.js');
                    parseCF(grunt.option("cfFile"));

                    var done = async();

                    setTimeout(function(err) {
                        grunt.log.writeln('Done!');
                        done(err);
                    }, 1000);
                }

            },
            createDist: {
                call: function(grunt, options, async) {

                    var distCF = require('./scripts/distCF.js');
                    distCF(grunt.option("cfFile"));

                    var done = async();

                    setTimeout(function(err) {
                        grunt.log.writeln('Done!');
                        done(err);
                    }, 1000);
                }

            },

            renameCFGui: {
                call: function(grunt, options, async) {
                    var regex = /(?:\w+|\d+)(?=.gui$)/;
                    var cfFile = grunt.option("cfFile");
                    var buildFile = regex.exec(cfFile) + '_build.gui';

                    grunt.file.copy('build/' + cfFile, 'build/' + buildFile);

                    var done = async();

                    setTimeout(function(err) {
                        grunt.file.delete('build/' + cfFile);
                        grunt.log.writeln('Copy Done!');
                        done(err);

                    }, 1000);
                }

            }
        },
        copy: {
            main: {
                files: [{
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: 'build/'

                    }

                ]

            }
        },
        'http-server': {
            dev: {
                // the server root directory
                root: 'public/',

                port: 8019,
                host: "zymplsi-mbp.local",

                // cache: < sec > ,
                showDir: true,
                autoIndex: true,
                //   defaultExt: "html",

                //wait or not for the process to finish
                // runInBackground: true | false
            }
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: 'public/app.zip',
                    mode: 'zip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**','assets/*'],
                dest: '/'

            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-compress');



    grunt.task.registerTask('buildCF', 'creating CF build files', function(arg1) {
        if (arguments.length === 0) {
            grunt.log.writeln('please state the .gui file');

        } else {
            grunt.log.writeln(this.name + ", " + arg1);

            grunt.option("cfFile", arg1);
            grunt.task.run('jshint');
            grunt.task.run('execute:createBuild');
            grunt.task.run('copy');
            grunt.task.run('execute:renameCFGui');

        }
    });

    grunt.task.registerTask('distCF', 'creating CF dist files', function(arg1) {
        if (arguments.length === 0) {
            grunt.log.writeln('please state the .gui file');

        } else {
            grunt.log.writeln(this.name + ", " + arg1);

            grunt.option("cfFile", arg1);
            grunt.task.run('jshint');
            grunt.task.run('execute:createDist');


        }
    });

    grunt.task.registerTask('uploadCF', ['compress', 'http-server:dev']);


};
