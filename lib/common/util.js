'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseOptionsFromArguments = parseOptionsFromArguments;
exports.parseOptionFromArguments = parseOptionFromArguments;
exports.parseFilesFromArguments = parseFilesFromArguments;
exports.someInclude = someInclude;
exports.getSafePassword = getSafePassword;
exports.isValidPassword = isValidPassword;
exports.isValidCipher = isValidCipher;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _const = require('./const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cryptify - A file-based encryption utility for Node.js
 * Copyright (C) 2017 Mike Chabot
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

function parseOptionsFromArguments(lookIn, lookFor, getArgument) {
    if (!lookIn || !lookFor) return [];
    return lookIn.map(function (value, index) {
        return lookFor.includes(value) ? getArgument ? lookIn[index + 1] : value : null;
    }).filter(function (value) {
        return value;
    });
}

function parseOptionFromArguments(lookIn, lookFor, getArgument) {
    if (!lookIn || !lookFor) return;
    return parseOptionsFromArguments(lookIn, lookFor, getArgument)[0];
}

function parseFilesFromArguments(args) {
    var files = [];
    args.forEach(function (value, index) {
        if (!_const.OPTION_ARRAY.includes(value) && !_const.OPTIONS_WITH_ARGS.includes(args[index - 1]) && !files.includes(value)) {
            files.push(value);
        }
    });
    return files;
}

/**
 * Look in an array for an array of values
 * @param lookIn
 * @param lookFor
 * @returns {boolean}
 * @private
 */
function someInclude(lookIn, lookFor) {
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
function getSafePassword(password) {
    var safePassword = [];
    var length = password.length;
    for (var i = 0; i < length - 2; i++) {
        safePassword.push('*');
    }
    safePassword.unshift(password[0]);
    safePassword.push(password[length - 1]);
    return safePassword.join('');
}

function isValidPassword(password) {
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
    return password !== null && password !== undefined && typeof password === 'string' && password.trim().length >= 8 && someInclude(password.trim().split(''), _const.SPECIAL_CHARACTERS) && _hasNumber(password) && _hasUpperCase(password) && _hasLowerCase(password);
}

function isValidCipher(cipher) {
    if (!cipher) return false;
    return _crypto2.default.getCiphers().includes(cipher);
}