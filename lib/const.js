'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var packageJson = require('../package.json');

/**
 * Cryptify constants
 * @author Mike Chabot
 */

var CRYPTIFY_VERSION = packageJson.version;

/**
 * Password special characters
 * https://www.owasp.org/index.php/Password_special_characters
 * @type {[*]}
 */
var SPECIAL_CHARACTERS = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

/**
 * Cryptify commands
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], KEEP: [*], PASSWORD: [*], LOG: [*], HELP: [*], VERSION: [*]}}
 */
var OPTIONS = {
    ENCRYPT: ['-e', '--encrypt'],
    DECRYPT: ['-d', '--decrypt'],
    CIPHER: ['-c', '--cipher'],
    KEEP: ['-k', '--keep'],
    PASSWORD: ['-p', '--password'],
    LOG: ['-l', '--log'],
    HELP: ['-h', '--help'],
    VERSION: ['-v', '--version']
};

/**
 * Required commands
 * @type {[*]}
 */
var REQUIRED_COMMANDS = [].concat(_toConsumableArray(OPTIONS.ENCRYPT), _toConsumableArray(OPTIONS.DECRYPT));

/**
 * Optional arguments
 * @type {[*]}
 */
var OPTIONS_DO_NOT_TAKE_ARGUMENT = [].concat(_toConsumableArray(OPTIONS.KEEP), _toConsumableArray(OPTIONS.LOG), _toConsumableArray(OPTIONS.HELP), _toConsumableArray(OPTIONS.VERSION));

var OPTIONS_TAKE_ARGUMENT = [].concat(_toConsumableArray(OPTIONS.PASSWORD), _toConsumableArray(OPTIONS.CIPHER));

module.exports = {
    OPTIONS: OPTIONS,
    REQUIRED_COMMANDS: REQUIRED_COMMANDS,
    OPTIONS_DO_NOT_TAKE_ARGUMENT: OPTIONS_DO_NOT_TAKE_ARGUMENT,
    OPTIONS_TAKE_ARGUMENT: OPTIONS_TAKE_ARGUMENT,
    CRYPTIFY_VERSION: CRYPTIFY_VERSION,
    SPECIAL_CHARACTERS: SPECIAL_CHARACTERS
};