'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    CONSTANTS: {
      // configurable paths
      app: 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= CONSTANTS.app %>/scripts/**/*.js'],
        // tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= CONSTANTS.app %>/styles/**/*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= CONSTANTS.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= CONSTANTS.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    jsbeautifier: {
      options: {
        config: '.jsbeautifyrc'
      },
      verify: {
        options: {
          mode: 'VERIFY_ONLY'
        },
        src: [
          'Gruntfile.js',
          'app/scripts/**/*.js',
          'test/**/*.js',
          'karma.conf.js',
          'karma-e2e.conf.js',
          'package.json',
          'bower.json',
          'npm-shrinkwrap.json'
        ],
      },
      update: {
        options: {
          mode: 'VERIFY_AND_WRITE'
        },
        src: [
          'Gruntfile.js',
          'app/scripts/**/*.js',
          'test/**/*.js',
          'karma.conf.js',
          'karma-e2e.conf.js',
          'package.json',
          'bower.json',
          'npm-shrinkwrap.json'
        ],
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= CONSTANTS.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= CONSTANTS.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= CONSTANTS.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= CONSTANTS.app %>/scripts/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= CONSTANTS.dist %>/*',
            '!<%= CONSTANTS.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '**/*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= CONSTANTS.app %>/index.html'],
        ignorePath: '<%= CONSTANTS.app %>/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= CONSTANTS.dist %>/scripts/**/*.js',
            '<%= CONSTANTS.dist %>/styles/**/*.css',
            '<%= CONSTANTS.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= CONSTANTS.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= CONSTANTS.app %>/index.html',
      options: {
        dest: '<%= CONSTANTS.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= CONSTANTS.dist %>/**/*.html'],
      css: ['<%= CONSTANTS.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= CONSTANTS.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= CONSTANTS.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= CONSTANTS.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= CONSTANTS.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= CONSTANTS.app %>/images',
          src: '**/*.svg',
          dest: '<%= CONSTANTS.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= CONSTANTS.dist %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= CONSTANTS.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= CONSTANTS.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= CONSTANTS.app %>',
          dest: '<%= CONSTANTS.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/**/*.html',
            'images/**/*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= CONSTANTS.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= CONSTANTS.app %>/styles',
        dest: '.tmp/styles/',
        src: '**/*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= CONSTANTS.dist %>/styles/main.css': [
    //         '.tmp/styles/**/*.css',
    //         '<%= CONSTANTS.app %>/styles/**/*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= CONSTANTS.dist %>/scripts/scripts.js': [
    //         '<%= CONSTANTS.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    coverage: {
      options: {
        thresholds: {
          statements: 75,
          branches: 61,
          lines: 74,
          functions: 76
        },
        dir: './coverage/',
        root: '.'
      }
    },

    coveralls: {
      all: {
        src: 'coverage/**/lcov.info',
        force: true
      }
    },

    open: {
      dev: {
        path: 'http://localhost:9000/index.html'
      },
    },

    img: {
      // using only dirs with output path
      crush_them: {
        src: ['build/images/**/*.png']
      }
    }
  });


  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bower:install',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'bower:install',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma',
    'verify',
    'coverage',
    'coveralls:all'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bower:install',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'img',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', ['serve']);

  grunt.registerTask('format', ['jsbeautifier:update']);
  grunt.registerTask('verify', ['jshint', 'jsbeautifier:verify']);
};
