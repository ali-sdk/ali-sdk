/**!
 * ali-sdk - lib/oss.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

"use strict";

module.exports = function (options) {
  var oss = require('ali-oss');
  return oss(options);
};
