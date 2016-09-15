//
// This code is to allow all test files to easily require
// the test helper file, regardless of nested folder location.
//
// e.g. require(TEST_HELPER)
//
const path = require('path');

global.TEST_HELPER = path.join(__dirname, '/test-helper.js');
