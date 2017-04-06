/**
 * Cryptify constants
 * @author Mike Chabot
 */

const CRYPTIFY_VERSION = '1.0';

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
const OPTIONAL_ARGUMENTS_NO_ARGS = [
    ...OPTIONS.KEEP,
    ...OPTIONS.LOG,
    ...OPTIONS.HELP,
    ...OPTIONS.VERSION
];

module.exports = {
    OPTIONS,
    REQUIRED_COMMANDS,
    OPTIONAL_ARGUMENTS_NO_ARGS,
    CRYPTIFY_VERSION,
    SPECIAL_CHARACTERS
};
