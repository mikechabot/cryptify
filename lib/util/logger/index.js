"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Log a blank line
 */
var blank = () => {
  log('');
};
/**
 * Log an error object, or a default string
 * @param error
 */


var error = error => {
  log(" \u2718 ".concat(error && error.message || 'An error has occurred'));
};
/**
 * Log a message with a checkmark
 * @param message
 */


var info = message => {
  if (message === null || message === undefined) {
    return;
  }

  log(" \u2713 ".concat(message));
};
/**
 * Log a message to the console
 * @param message
 */


var log = message => {
  console.log(message);
};

var _default = {
  blank,
  info,
  error,
  log
};
exports.default = _default;