'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var packageDotJson = require('../package.json');

/**
 * Cryptify constants
 * @author Mike Chabot
 */

var CRYPTIFY_VERSION = exports.CRYPTIFY_VERSION = packageDotJson.version;
var DEFAULT_CIPHER = exports.DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
var DEFAULT_ENCODING = exports.DEFAULT_ENCODING = 'utf8';
var EXTENSION = exports.EXTENSION = 'tmp';

/**
 * Cryptify options
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], KEEP: [*], PASSWORD: [*], DEBUG: [*], HELP: [*], VERSION: [*]}}
 */
var OPTION = exports.OPTION = {
    ENCRYPT: ['-e', '--encrypt'],
    DECRYPT: ['-d', '--decrypt'],
    CIPHER: ['-c', '--cipher'],
    KEEP: ['-k', '--keep'],
    PASSWORD: ['-p', '--password'],
    DEBUG: ['-l', '--log'],
    RETURN_FILE: ['-r', '--return'],
    HELP: ['-h', '--help'],
    VERSION: ['-v', '--version']
};

/**
 * Options that don't require an argument
 * @type {[*]}
 */
var OPTIONS_WITH_NO_ARGS = exports.OPTIONS_WITH_NO_ARGS = [].concat(_toConsumableArray(OPTION.KEEP), _toConsumableArray(OPTION.DEBUG), _toConsumableArray(OPTION.HELP), _toConsumableArray(OPTION.VERSION));

/**
 * Options that an argument
 * @type {[*]}
 */
var OPTIONS_WITH_ARGS = exports.OPTIONS_WITH_ARGS = [].concat(_toConsumableArray(OPTION.PASSWORD), _toConsumableArray(OPTION.CIPHER), _toConsumableArray(OPTION.RETURN_FILE));

/**
 * Required options
 * @type {[*]}
 */
var REQUIRED_OPTIONS = exports.REQUIRED_OPTIONS = [].concat(_toConsumableArray(OPTION.ENCRYPT), _toConsumableArray(OPTION.DECRYPT));

/**
 * Combined option arrays
 */
var OPTIONS = exports.OPTIONS = [].concat(_toConsumableArray(REQUIRED_OPTIONS), _toConsumableArray(OPTIONS_WITH_NO_ARGS), _toConsumableArray(OPTIONS_WITH_ARGS));

/**
 * Password special characters
 * https://www.owasp.org/index.php/Password_special_characters
 * @type {[*]}
 */
var SPECIAL_CHARACTERS = exports.SPECIAL_CHARACTERS = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

exports.default = {
    OPTION: OPTION,
    OPTIONS: OPTIONS,
    REQUIRED_OPTIONS: REQUIRED_OPTIONS,
    OPTIONS_WITH_NO_ARGS: OPTIONS_WITH_NO_ARGS,
    OPTIONS_WITH_ARGS: OPTIONS_WITH_ARGS,
    SPECIAL_CHARACTERS: SPECIAL_CHARACTERS,
    CRYPTIFY_VERSION: CRYPTIFY_VERSION,
    DEFAULT_CIPHER: DEFAULT_CIPHER,
    EXTENSION: EXTENSION
};