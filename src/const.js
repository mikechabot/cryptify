let packageJson = require('../package.json');

/**
 * Cryptify constants
 * @author Mike Chabot
 */

const CRYPTIFY_VERSION = packageJson.version;

/**
 * Password special characters
 * https://www.owasp.org/index.php/Password_special_characters
 * @type {[*]}
 */
const SPECIAL_CHARACTERS = [
    '!', '"', '#', '$', '%', '&', '\'', '(',
    ')', '*', '+', ',', '-', '.', '/', ':',
    ';', '<', '=', '>', '?', '@', '[', '\\',
    ']', '^', '_', '`', '{', '|', '}', '~'
];

/**
 * Cryptify commands
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], KEEP: [*], PASSWORD: [*], LOG: [*], HELP: [*], VERSION: [*]}}
 */
const OPTIONS = {
    ENCRYPT : ['-e', '--encrypt'],
    DECRYPT : ['-d', '--decrypt'],
    CIPHER  : ['-c', '--cipher'],
    KEEP    : ['-k', '--keep'],
    PASSWORD: ['-p', '--password'],
    LOG     : ['-l', '--log'],
    HELP    : ['-h', '--help'],
    VERSION : ['-v', '--version']
};

/**
 * Required commands
 * @type {[*]}
 */
const REQUIRED_COMMANDS = [
    ...OPTIONS.ENCRYPT,
    ...OPTIONS.DECRYPT
];

/**
 * Optional arguments
 * @type {[*]}
 */
const OPTIONS_DO_NOT_TAKE_ARGUMENT = [
    ...OPTIONS.KEEP,
    ...OPTIONS.LOG,
    ...OPTIONS.HELP,
    ...OPTIONS.VERSION
];

const OPTIONS_TAKE_ARGUMENT = [
    ...OPTIONS.PASSWORD,
    ...OPTIONS.CIPHER
];

module.exports = {
    OPTIONS,
    REQUIRED_COMMANDS,
    OPTIONS_DO_NOT_TAKE_ARGUMENT,
    OPTIONS_TAKE_ARGUMENT,
    CRYPTIFY_VERSION,
    SPECIAL_CHARACTERS
};
