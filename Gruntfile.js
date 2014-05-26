// This file is based on from popcornapp

module.exports = function(grunt) {

  "use strict";

  var buildPlatforms = parseBuildPlatforms(grunt.option('platforms'));

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build' , [
    'copy:js',
    'copy:public',
    'copy:components',
    'react',
    'less'
  ]);

  grunt.registerTask('dev' , [
    'build',
    'connect',
    'watch'
  ]);

  grunt.registerTask('nodewkbuild', [
    'nodewebkit:build',
    'copy:ffmpeg'
  ]);

  grunt.registerTask('build-app', [
    'build',
    'nodewebkit:build',
    'copy:ffmpeg'
  ]);

  grunt.registerTask('dist', [
    'default',
    'nodewebkit:dist',
    'copy:ffmpeg',
    'copy:package'
  ]);

  grunt.initConfig({
    nodewebkit: {
      build: {
        options: {
          version: '0.9.2',
          build_dir: './build/', // Where the build version of my node-webkit app is saved
          mac_icns: './icon.icns', // Path to the Mac icon file
          mac: buildPlatforms.mac,
          win: buildPlatforms.win,
          linux32: buildPlatforms.linux32,
          linux64: buildPlatforms.linux64
        },

        src: ['./index.html', './build/app/**/*', './node_modules/**', '!./node_modules/*grunt*/**', './package.json' ] // Your node-webkit app './**/*'
      },
      dist: {
        options: {
          version: '0.9.2',
          build_dir: './build/', // Where the build version of my node-webkit app is saved
          embed_nw: false, // Don't embed the .nw package in the binary
          keep_nw: true,
          mac_icns: './icon.icns', // Path to the Mac icon file
          mac: buildPlatforms.mac,
          win: buildPlatforms.win,
          linux32: buildPlatforms.linux32,
          linux64: buildPlatforms.linux64
        },
        src: ['./build/app/**/*', 'node_modules/cheerio', 'node_modules/request', './package.json' ] // Your node-webkit app './**/*'
      }
    },

    copy: {
      ffmpeg: {
        files: [
          {
            src: 'libraries/win/ffmpegsumo.dll',
            dest: 'build/releases/Mixplayer/win/Mixplayer/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'libraries/win/ffmpegsumo.dll',
            dest: 'build/cache/win/<%= nodewebkit.build.options.version %>/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'libraries/mac/ffmpegsumo.so',
            dest: 'build/releases/Mixplayer/mac/Mixplayer.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/mac/ffmpegsumo.so',
            dest: 'build/cache/mac/<%= nodewebkit.build.options.version %>/node-webkit.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/linux64/libffmpegsumo.so',
            dest: 'build/releases/Mixplayer/linux64/Mixplayer/libffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/linux64/libffmpegsumo.so',
            dest: 'build/cache/linux64/<%= nodewebkit.build.options.version %>/libffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/linux32/libffmpegsumo.so',
            dest: 'build/releases/Mixplayer/linux32/Mixplayer/libffmpegsumo.so',
            flatten: true
          },
          {
            src: 'libraries/linux32/libffmpegsumo.so',
            dest: 'build/cache/linux32/<%= nodewebkit.build.options.version %>/libffmpegsumo.so',
            flatten: true
          }
        ]
      },
      package: {
        files: [
          {
            src: 'build/releases/Mixplayer/Mixplayer.nw',
            dest: 'build/releases/Mixplayer/linux32/Mixplayer/package.nw',
            flatten: true
          },
          {
            src: 'build/releases/Mixplayer/Mixplayer.nw',
            dest: 'build/releases/Mixplayer/linux64/Mixplayer/package.nw',
            flatten: true
          }
        ]
      },
      js: {
        expand: true,
        src: './app/js/**/*.js',
        dest: './build'
      },
      jsx: {
        expand: true,
        src: './app/jsx/**/*.jsx',
        dest: './build'
      },
      public: {
        expand: true,
        src: './app/public/**/*',
        dest: './build'
      },
      components: {
        expand: true,
        src: './app/components/**/*',
        dest: './build'
      }
    },

    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: './app/jsx',
            src: ['**/*.jsx'],
            dest: './build/app/jsx',
            ext: '.js'
          }
        ]
      }
    },

    watch: {
      js: {
        files: './app/js/**/*.js',
        tasks: ['copy:js'],
        options: {
          livereload: true,
        }
      },
      jsx: {
        files: './app/jsx/**/*.jsx',
        tasks: ['react'],
        options: {
          livereload: true,
        }
      },
      styles: {
        files: './app/styles/**/*.less',
        tasks: ['less'],
        options: {
          livereload: true,
        }
      },
      html: {
        files: './app/index.html',
        tasks: ['copy:html'],
        options: {
          livereload: true,
        }
      },
      public: {
        files: './app/public/**/*',
        tasks: ['copy:public'],
        options: {
          livereload: true,
        }
      },
      components: {
        files: './app/components/**/*',
        tasks: ['copy:components'],
        options: {
          livereload: true,
        }
      },

    },

    less: {
      dist: {
        files: {
          './build/app/styles/app.css': './app/styles/app.less'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 3001,
          hostname: '*'
        }
      }
    }
  });
};

var parseBuildPlatforms = function(argumentPlatform) {
  // this will make it build no platform when the platform option is specified
  // without a value which makes argumentPlatform into a boolean
  var inputPlatforms = argumentPlatform || process.platform + ";" + process.arch;

  // Do some scrubbing to make it easier to match in the regexes bellow
  inputPlatforms = inputPlatforms.replace("darwin", "mac");
  inputPlatforms = inputPlatforms.replace(/;ia|;x|;arm/, "");

  var buildAll = /^all$/.test(inputPlatforms);

  var buildPlatforms = {
    mac: /mac/.test(inputPlatforms) || buildAll,
    win: /win/.test(inputPlatforms) || buildAll,
    linux32: /linux32/.test(inputPlatforms) || buildAll,
    linux64: /linux64/.test(inputPlatforms) || buildAll
  };

  return buildPlatforms;
};
