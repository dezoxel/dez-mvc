module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine: {
      all: {
        src: 'lib/**/*.js',
        options: {
          specs: 'test/**/*.spec.js',
          helpers: 'test/*.helper.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'test/main.js'
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'test/*.js',
      ]
    },

    clean: {
      previous: [
        'lib/dez-mvc.js',
      ],
    },

    concat: {
      options: {
        separator: ';',
        process: function (src, filepath) {
          return giveAMDName(filepath, src);
        }
      },
      dist: {
        src: ['lib/**/*.js'],
        dest: 'lib/dez-mvc.js',
      },
    },

    uglify: {
      dist: {
        src: 'lib/dez-mvc.js',
        dest: 'lib/dez-mvc.js',
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['clean', 'concat', 'uglify']);
  grunt.registerTask('dev', ['clean', 'concat']);

  /**
   * Gives name for module.
   *
   * @param src Ex: "define(['some/module'], function(){})"
   * @param filepath Ex: "events/bus.js"
   *
   * Example:
   *    Before: define(['some/module']);
   *    After:  define('dez-mvc/events/bus', ['some/module']);
   *
   */
  function giveAMDName(filepath, src) {
    var moduleName = filepath.slice(0, -3);

    // TODO: It should be fixed through "dist" options, we should cut "lib/" here
    // Cutting "lib/" from the start.
    moduleName = moduleName.slice(4);
    var srcPrefix = "define('dez-mvc/" + moduleName;

    if (/define\s*\(\s*function/.test(src)) {
      src = src.replace(/define\s*\(\s*function/, srcPrefix + "', [], function");
    } else if (/define\s*\(\s*\[/.test(src)) {
      src = src.replace(/define\s*\(\s*\[/, srcPrefix + "', [");
    }
    return src;
  }
};
