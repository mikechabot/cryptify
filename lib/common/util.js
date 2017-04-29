'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._contains = _contains;
exports._getSafePassword = _getSafePassword;
exports._isValidPassword = _isValidPassword;

var _const = require('./const');

/**
 * Look in an array for an array of values
 * @param lookIn
 * @param lookFor
 * @returns {boolean}
 * @private
 */
function _contains(lookIn, lookFor) {
    if (!lookIn || !lookFor) return false;
    return lookFor.some(function (entry) {
        return lookIn.includes(entry);
    });
}

/**
 * Replace a password string with asterisks.
 * Leaves the first and last characters in plain text
 * @param password
 * @returns {string}
 * @private
 */
function _getSafePassword(password) {
    var safePassword = [];
    var length = password.length;
    for (var i = 0; i < length - 2; i++) {
        safePassword.push('*');
    }
    safePassword.unshift(password[0]);
    safePassword.push(password[length - 1]);
    return safePassword.join('');
}

function _isValidPassword(password) {
    function _hasUpperCase(str) {
        if (!str) return false;
        return str.trim().toLowerCase() !== str;
    }
    function _hasLowerCase(str) {
        if (!str) return false;
        return str.trim().toUpperCase() !== str;
    }
    function _hasNumber(str) {
        if (!str) return false;
        return (/\d/.test(str)
        );
    }
    return password !== null && password !== undefined && typeof password === 'string' && password.trim().length >= 8 && _contains(password.trim().split(''), _const.SPECIAL_CHARACTERS) && _hasNumber(password) && _hasUpperCase(password) && _hasLowerCase(password);
}