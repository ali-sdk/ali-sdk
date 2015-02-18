/**!
 * ali-sdk - test/oss.test.js
 *
 * Copyright(c) fengmk2 and other contributors.
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
var oss = require('../lib/oss');
var config = require('./config');

describe('oss.test.js', function () {
  before(function () {
    this.store = oss(config.oss);
  });

  describe('put()', function () {
    it('should add object with local file path', function* () {
      var object = yield oss.put('ali-sdk/oss/put-localfile.js', __filename);
      assert(object, 'object not exists');
    });
  });
});
