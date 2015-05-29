module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      build: {
        src: ['src/start.js', 'src/vars.js', 'src/star_constructor.js', 'src/wrangler.js', 
              'src/visualizations/params.js', 'src/start_selection.js', 
              'src/visualizations/dotplot.js', 'src/visualizations/sparkline.js',  'src/visualizations/table.js', 
              'src/visualizations/treemap.js', 'src/visualizations/scatterplot.js', 'src/visualizations/grid.js', 
              'src/visualizations/geomap.js', 'src/visualizations/linechart.js', 'src/visualizations/nodelink.js', 
              'src/visualizations/piechart.js', 'src/visualizations/barchart.js', 'src/visualizations/stacked.js', 
              'src/visualizations/matrix.js', 'src/ui.js', 'src/getterssetters.js', 'src/end_constructor.js', 
              'src/utils.js', 'src/end.js'],
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
        files: ['src/*.js'],
        tasks: ['concat']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['concat', 'watch']);
};