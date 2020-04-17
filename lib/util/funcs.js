"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPassword = isValidPassword;
exports.isValidCipherAlgorithm = isValidCipherAlgorithm;
exports.getSafePassword = getSafePassword;

var _crypto = _interopRequireDefault(require("crypto"));

var _const = require("../const");

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Ensure the password meets complexity requirements
 * @param password
 * @returns {boolean|boolean}
 */
function isValidPassword(password) {
  return password !== null && password !== undefined && typeof password === 'string' && password.trim().length >= 8 && (0, _helpers.someInclude)(password.trim().split(''), _const.SPECIAL_CHARACTERS) && (0, _helpers.hasNumber)(password) && (0, _helpers.hasUpperCase)(password) && (0, _helpers.hasLowerCase)(password);
}
/**
 * Ensure the cipher is supported by OpenSSL
 * @param cipher
 * @returns {boolean}
 */


function isValidCipherAlgorithm(cipher) {
  if (cipher === null || cipher === undefined || typeof cipher !== 'string') {
    return false;
  }

  return _crypto.default.getCiphers().includes(cipher);
}
/**
 * Replace a password string with asterisks.
 * Leaves the first and last characters in plain text
 * @param password
 * @returns {string|null}
 */


function getSafePassword(password) {
  if (password === null || password === undefined || typeof password !== 'string' || password.trim().length < 3) {
    return null;
  }

  var safePassword = [];
  var length = password.length;

  for (var i = 0; i < length - 2; i++) {
    safePassword.push('*');
  }

  safePassword.unshift(password[0]);
  safePassword.push(password[length - 1]);
  return safePassword.join('');
}