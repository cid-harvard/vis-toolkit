module.exports = function(grunt) {
  grunt.initConfig({

    'string-replace': {
      version: {
        files: {
          './': 'build/vistk.js',
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    },

    tape: {
      options: {
        pretty: true,
        output: 'console'
      },
      files: ['test/*.js']
    },

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      build: {
        src: ['js/superformula.js', 'src/start.js', 'src/utils.js', 'src/vars.js',
              'src/events.js', 'src/star_constructor.js', 'src/wrangler.js', 'src/locales.js',
              'src/marks/svg_rect.js', 'src/marks/svg_circle.js',
              'src/visualizations/*.js',
              'src/start_selection.js', 'src/templates/table.js',
              'src/templates/boxplot.js', 'src/templates/none.js',
              'src/templates/default.js', 'src/ui.js', 'src/getterssetters.js',
              'src/end_constructor.js', 'src/end.js'],
        dest: 'build/vistk.js',
      },
    },

    jshint: {
      files: ['Gruntfile.js', 'build/vistk.js'],

      beforeconcat: ['build/vistk.js'],
      afterconcat: ['build/vistk.js'],

      options: {
       jshintrc: true
      }
    },

    watch: {
      concat: {
        files: ['src/*.js', 'src/**/*.js'],
        tasks: ['string-replace', 'concat']
      },
      tasks: ['string-replace']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-tape');

  grunt.registerTask('default', ['concat', 'string-replace']);
  grunt.registerTask('test', ['tape']);
};
