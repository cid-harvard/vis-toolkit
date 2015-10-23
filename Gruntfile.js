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

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      build: {
        src: ['js/superformula.js', 'src/start.js', 'src/utils.js', 'src/vars.js', 'src/events.js', 'src/star_constructor.js', 'src/wrangler.js',
              'src/visualizations/sparkline.js', 'src/visualizations/dotplot.js',
              'src/visualizations/barchart.js', 'src/visualizations/linechart.js', 'src/visualizations/scatterplot.js', 'src/visualizations/geomap.js',
              'src/visualizations/grid.js', 'src/visualizations/stacked.js', 'src/visualizations/piechart.js', 'src/visualizations/slopegraph.js',
              'src/visualizations/treemap.js', 'src/visualizations/radial.js', 'src/visualizations/stackedbar.js', 'src/visualizations/rectmap.js',
              'src/visualizations/productspace.js', 'src/visualizations/ordinal_vertical.js', 'src/visualizations/ordinal_horizontal.js', 'src/visualizations/matrix.js',
              'src/start_selection.js', 'src/visualizations/table.js',
              'src/visualizations/boxplot.js', 'src/visualizations/none.js',
              'src/visualizations/default.js', 'src/ui.js', 'src/getterssetters.js',
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
        files: ['src/*.js', 'src/visualizations/*.js'],
        tasks: ['string-replace', 'concat']
      },
      tasks: ['string-replace']
    },

    jasmine : {
      src : ['js/d3.js', 'build/vistk.js'],
      specs : 'test/specs/*.js',
      helpers : 'test/specs/helpers/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('default', ['concat', 'string-replace']);
};
