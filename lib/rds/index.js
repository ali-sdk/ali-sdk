/**!
 * ali-sdk - rds/index.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

module.exports = function (options) {
  var RDSClient = require('./client');
  return new RDSClient(options);
};
