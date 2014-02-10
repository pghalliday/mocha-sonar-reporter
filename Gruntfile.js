module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Project configuration.
  grunt.initConfig({
    clean: {
      coverage: {
        src: ['lib-cov/']
      }
    },
    copy: {
      test: {
        src: ['test/**'],
        dest: 'lib-cov/'
      },
      fixtures: {
        src: ['fixtures/**'],
        dest: 'lib-cov/'
      }
    },
    blanket: {
      lib: {
        src: ['lib/'],
        dest: 'lib-cov/lib/'
      },
      mock: {
        src: ['mocks/'],
        dest: 'lib-cov/mocks/'
      }
    },
    mochaTest: {
      'spec': {
        options: {
          reporter: 'spec',
          // tests are quite slow as thy spawn node processes
          timeout: 10000
        },
        src: ['lib-cov/test/**/*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['lib-cov/test/**/*.js']
      },
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'lcov.info'
        },
        src: ['lib-cov/test/**/*.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['lib-cov/test/**/*.js']
      }
    },
    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'lcov.info'
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['clean', 'blanket', 'copy']);
  grunt.registerTask('default', ['build', 'mochaTest']);
  grunt.registerTask('ci', ['default', 'coveralls']);
};