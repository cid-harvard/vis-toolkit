module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      build: {
        src: ['src/start.js', 'src/vars.js', 'src/star_constructor.js', 'src/visualizations/table.js', 'src/visualizations/treemap.js', 'src/visualizations/scatterplot.js', 'src/visualizations/sparkline.js', 'src/visualizations/geomap.js', 'src/visualizations/linechart.js', 'src/visualizations/nodelink.js', 'src/visualizations/dotplot.js', 'src/core.js', 'src/ui.js', 'src/getterssetters.js', 'src/end_constructor.js', 'src/utils.js', 'src/end.js'],
        dest: 'build/vistk.js',
      },
    },
    watch: {
      concat: {
        files: ['src/*.js'],
        tasks: "concat"
      }
    }

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'watch']);

};