// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  var find = function(arr, predicate) {
    for (var i = 0, value, l = arr.length; i < l && i in arr; i++) {
      value = arr[i];

      if (predicate(value, i, arr)) {
        return value;
      }
    }

    return undefined;
  };
  var PARAMETER = '--file=';

  var files = [
    'app/bower_components/angular/angular.js',
    'app/bower_components/angular-mocks/angular-mocks.js',
    'app/bower_components/angular-resource/angular-resource.js',
    'app/bower_components/angular-cookies/angular-cookies.js',
    'app/bower_components/angular-sanitize/angular-sanitize.js',
    'app/bower_components/angular-route/angular-route.js',
    'app/scripts/*.js',
    'app/scripts/**/*.js',
    'test/mock/**/*.js'
  ];

  var arg = find(process.argv, function(arg) {
    return arg.indexOf(PARAMETER) >= 0
  });

  if (arg) {
    var file = arg.substr(PARAMETER.length).split(',');
    file.forEach(function(val) {
      files.push(val);
    });
  } else {
    files.push('test/spec/**/*.js');
  }

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: files,

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    preprocessors: {
      'app/scripts/**/*.js': ['coverage']
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [{
        type: 'lcov',
        dir: 'coverage/'
      }, {
        type: 'json',
        dir: 'coverage/'
      }, {
        type: 'text'
      }, {
        type: 'text-summary'
      }]
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // How long does Karma wait for a browser to reconnect (in ms).
    browserDisconnectTimeout: 180000,

    // The number of disconnections tolerated
    browserDisconnectTolerance: 100,

    // How long does Karma wait for a message from a browser before disconnecting it (in ms).
    browserNoActivityTimeout: 300000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
