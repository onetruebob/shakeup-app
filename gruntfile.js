module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      deploy: {
        files: [
          {expand: true, cwd: 'client/', src: ['*'], dest: 'public/dist', filter: 'isFile'},
          {expand: true, cwd: 'client/bower_components', src: ['**'], dest: 'public/dist/components'},
          {expand: true, cwd: 'client/styles', src: ['**'], dest: 'public/dist/styles'},
          {expand: true, cwd: 'node_modules/queue-async', src: ['**'], dest: 'public/dist/components/queue-async'},
          {expand: true, cwd: 'node_modules/topojson', src: ['**'], dest: 'public/dist/components/topojson'},
        ]
      }
    },

    concat: {
      options: {},
      deploy: {
        src: ['client/globe.js', 'client/quakedata.js', 'client/quakeDetailView.js', 'client/app.js'],
        dest: 'public/dist/app.js'
      }
    },

    uglify: {
      deploy: {
        files: {
          'public/dist/app.min.js': ['public/dist/app.js']
        }
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////


  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'copy:deploy',
    'concat:deploy',
    'uglify:deploy'
  ]);


};
