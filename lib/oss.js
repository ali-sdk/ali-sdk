/**!
 * ali-sdk - lib/oss.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var oss = require('ali-oss');

module.exports = function (options) {
  return oss(options);
};
