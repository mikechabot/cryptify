'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var packageDotJson = require('../../package.json');

/**
 * Cryptify options
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], PASSWORD: [*], HELP: [*], VERSION: [*]}}
 */
var OPTION_MAP = exports.OPTION_MAP = {
    ENCRYPT: ['-e', '--encrypt'],
    DECRYPT: ['-d', '--decrypt'],
    CIPHER: ['-c', '--cipher'],
    PASSWORD: ['-p', '--password'],
    RETURN_FILE: ['-r', '--return'],
    FILE_ENCODING: ['-n', '--encoding'],
    HELP: ['-h', '--help'],
    VERSION: ['-v', '--version']
};

/**
 * Options that don't require an argument
 * @type {[*]}
 */
var OPTIONS_WITH_NO_ARGS = exports.OPTIONS_WITH_NO_ARGS = [].concat(_toConsumableArray(OPTION_MAP.HELP), _toConsumableArray(OPTION_MAP.VERSION), _toConsumableArray(OPTION_MAP.RETURN_FILE));

/**
 * Options that an argument
 * @type {[*]}
 */
var OPTIONS_WITH_ARGS = exports.OPTIONS_WITH_ARGS = [].concat(_toConsumableArray(OPTION_MAP.PASSWORD), _toConsumableArray(OPTION_MAP.CIPHER), _toConsumableArray(OPTION_MAP.FILE_ENCODING));

/**
 * Required options
 * @type {[*]}
 */
var REQUIRED_OPTIONS = exports.REQUIRED_OPTIONS = [].concat(_toConsumableArray(OPTION_MAP.ENCRYPT), _toConsumableArray(OPTION_MAP.DECRYPT));

/**
 * Combined option arrays
 */
var OPTION_ARRAY = exports.OPTION_ARRAY = [].concat(_toConsumableArray(REQUIRED_OPTIONS), _toConsumableArray(OPTIONS_WITH_NO_ARGS), _toConsumableArray(OPTIONS_WITH_ARGS));

/**
 * Password special characters
 * https://www.owasp.org/index.php/Password_special_characters
 * @type {[*]}
 */
var SPECIAL_CHARACTERS = exports.SPECIAL_CHARACTERS = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

var CRYPTIFY_VERSION = exports.CRYPTIFY_VERSION = packageDotJson.version;
var DEFAULT_COMMAND = exports.DEFAULT_COMMAND = OPTION_MAP.ENCRYPT[0];
var DEFAULT_CIPHER = exports.DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
var DEFAULT_ENCODING = exports.DEFAULT_ENCODING = 'utf8';
var EXTENSION = exports.EXTENSION = 'tmp';

var CLOSE_EVENT = exports.CLOSE_EVENT = 'close';
var COMMAND = exports.COMMAND = 'command';
var PASSWORD = exports.PASSWORD = 'password';
var ENCODING = exports.ENCODING = 'encoding';
var CIPHER = exports.CIPHER = 'cipher';

exports.default = {
    OPTION_MAP: OPTION_MAP,
    OPTION_ARRAY: OPTION_ARRAY,
    REQUIRED_OPTIONS: REQUIRED_OPTIONS,
    OPTIONS_WITH_NO_ARGS: OPTIONS_WITH_NO_ARGS,
    OPTIONS_WITH_ARGS: OPTIONS_WITH_ARGS,
    SPECIAL_CHARACTERS: SPECIAL_CHARACTERS,
    CRYPTIFY_VERSION: CRYPTIFY_VERSION,
    DEFAULT_COMMAND: DEFAULT_COMMAND,
    DEFAULT_ENCODING: DEFAULT_ENCODING,
    DEFAULT_CIPHER: DEFAULT_CIPHER,
    EXTENSION: EXTENSION,
    CLOSE_EVENT: CLOSE_EVENT,
    COMMAND: COMMAND,
    PASSWORD: PASSWORD,
    ENCODING: ENCODING,
    CIPHER: CIPHER
};