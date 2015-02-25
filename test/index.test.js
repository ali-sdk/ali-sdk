/**!
 * ali-sdk - test/index.test.js
 *
 * Copyright(c) 2015 ali-sdk and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var assert = require('assert');
var sdk = require('../');

describe('index.test.js', function () {
  it('should auth create services', function () {
    assert.deepEqual(Object.keys(sdk), ['oss', 'rds']);
    Object.keys(sdk).forEach(function (service) {
      assert.equal(typeof sdk[service], 'function');
    });
  });
});
