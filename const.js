/**
 * Cryptify constants
 * @author Mike Chabot
 */

const CRYPTIFY_VERSION = '1.0';
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
const OPTIONAL_ARGUMENTS = [
    ...OPTIONS.CIPHER,
    ...OPTIONS.KEEP,
    ...OPTIONS.LOG
];

/**
 * Other arguments
 * @type {[*]}
 */
const OTHER_ARGUMENTS = [
    ...OPTIONS.HELP,
    ...OPTIONS.VERSION
];

/**
 * Allowed arguments
 * @type {[*]}
 */
const ALLOWED_ARGUMENTS = [
    ...REQUIRED_COMMANDS,
    ...OPTIONAL_ARGUMENTS,
    ...OTHER_ARGUMENTS,
    ...OPTIONS.PASSWORD
];

const TAKES_ARGUMENT = [
    ...OPTIONAL_ARGUMENTS,
    ...OPTIONS.PASSWORD
];

module.exports = {
    OPTIONS,
    REQUIRED_COMMANDS,
    OTHER_ARGUMENTS,
    ALLOWED_ARGUMENTS,
    TAKES_ARGUMENT,
    CRYPTIFY_VERSION,
    SPECIAL_CHARACTERS
};
