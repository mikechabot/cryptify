const packageDotJson = require('../package.json');

/**
 * Cryptify constants
 * @author Mike Chabot
 */

export const CRYPTIFY_VERSION = packageDotJson.version;
export const DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
export const EXTENSION = 'tmp';

/**
 * Cryptify options
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], KEEP: [*], PASSWORD: [*], DEBUG: [*], HELP: [*], VERSION: [*]}}
 */
export const OPTION = {
    ENCRYPT    : ['-e', '--encrypt'],
    DECRYPT    : ['-d', '--decrypt'],
    CIPHER     : ['-c', '--cipher'],
    KEEP       : ['-k', '--keep'],
    PASSWORD   : ['-p', '--password'],
    DEBUG      : ['-l', '--log'],
    RETURN_FILE: ['-r', '--return'],
    HELP       : ['-h', '--help'],
    VERSION    : ['-v', '--version']
};

/**
 * Options that don't require an argument
 * @type {[*]}
 */
export const OPTIONS_WITH_NO_ARGS = [
    ...OPTION.KEEP,
    ...OPTION.DEBUG,
    ...OPTION.HELP,
    ...OPTION.VERSION,
    ...OPTION.RETURN_FILE
];

/**
 * Options that an argument
 * @type {[*]}
 */
export const OPTIONS_WITH_ARGS = [
    ...OPTION.PASSWORD,
    ...OPTION.CIPHER
];

/**
 * Required options
 * @type {[*]}
 */
export const REQUIRED_OPTIONS = [
    ...OPTION.ENCRYPT,
    ...OPTION.DECRYPT
];

/**
 * Combined option arrays
 */
export const OPTIONS = [
    ...REQUIRED_OPTIONS,
    ...OPTIONS_WITH_NO_ARGS,
    ...OPTIONS_WITH_ARGS
];

/**
 * Password special characters
 * https://www.owasp.org/index.php/Password_special_characters
 * @type {[*]}
 */
export const SPECIAL_CHARACTERS = [
    '!', '"', '#', '$', '%', '&', '\'', '(',
    ')', '*', '+', ',', '-', '.', '/', ':',
    ';', '<', '=', '>', '?', '@', '[', '\\',
    ']', '^', '_', '`', '{', '|', '}', '~'
];

export default {
    OPTION,
    OPTIONS,
    REQUIRED_OPTIONS,
    OPTIONS_WITH_NO_ARGS,
    OPTIONS_WITH_ARGS,
    SPECIAL_CHARACTERS,
    CRYPTIFY_VERSION,
    DEFAULT_CIPHER,
    EXTENSION
};
