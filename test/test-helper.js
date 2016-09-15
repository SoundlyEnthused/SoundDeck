const path = require('path');

process.env.NODE_ENV = 'test';

// The following allows you to require files independent of
// the location of your test file.
// Example:
//  var User = require(__server + '/models/user.js')
//
global.__server = path.join(__dirname, '/../server');
global.__client = path.join(__dirname, '/../client');

//
// Assertions
//
const chai = require('chai');
// Option 1: Make the `expect` function available in every test file
global.expect = chai.expect;
// Option 2: Make everything should-able
// global.should = chai.should()


//
// Helper Functions
//
// This is the object you can attach any helper functions used across
// several test files.
global.TestHelper = {};

//
// Mock apps for API testing
//
const express = require('express');

TestHelper.createApp = function (loader) {
  const app = express();
  app.use(require('body-parser').json());

  app.testReady = function () {
    // Log all errors
    app.use((err, req, res, next) => {
      console.error('==Error==');
      console.error('   ' + err.stack);
      next(err);
    });
  };
  return app;
};

//
// Mocha "helpers" to support coroutines tests
//
const Bluebird = require('bluebird');

global.before_ = function (f) { before(Bluebird.coroutine(f)); };
global.beforeEach_ = function (f) { beforeEach(Bluebird.coroutine(f)); };
global.it_ = function (description, f) { it(description, Bluebird.coroutine(f)); };
global.xit_ = function (description, f) { xit(description, f); };
global.it_.only = function (description, f) { it.only(description, Bluebird.coroutine(f)); };
