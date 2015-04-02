module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      build: {
        src: ['src/start.js', 'src/core.js', 'src/end.js'],
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

  grunt.registerTask('default', ['concat', 'watch']);

};
