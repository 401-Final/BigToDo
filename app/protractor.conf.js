exports.config = {

  allScriptsTimeout: 11000,

    // list of file globs
  specs: [
    'test-e2e/**/*.js'
  ],

    // OR, define suites:

    // suites: {
    //     welcome: 'test-e2e/welcome.test.js',
    //     full: 'test-e2e/**/*.test.js'
    // },

  capabilities: {
    browserName: 'chrome'
  },

    // Leave this out and protractor will start a server for us
    // seleniumAddress: 'http://localhost:4444/wd/hub',

  baseUrl: 'http://localhost:8000',

  framework: 'jasmine',

  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  }
};