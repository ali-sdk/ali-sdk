/**!
 * ali-sdk - index.js
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

var services = [
  'oss',
  'rds',
];

services.forEach(function (service) {
  exports[service] = lazyLoad(service);
});

function lazyLoad(service) {
  return function (options) {
    return require('ali-' + service)(options);
  };
}
