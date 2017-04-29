/**
 * Various cryptify constants
 */
const packageDotJson = require('../../package.json');

export const CRYPTIFY_VERSION = packageDotJson.version;
export const DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
export const DEFAULT_ENCODING = 'utf8';
export const EXTENSION = 'tmp';

/**
 * Cryptify options
 * @type {{ENCRYPT: [*], DECRYPT: [*], CIPHER: [*], PASSWORD: [*], DEBUG: [*], HELP: [*], VERSION: [*]}}
 */
export const OPTION_MAP = {
    ENCRYPT      : ['-e', '--encrypt'],
    DECRYPT      : ['-d', '--decrypt'],
    CIPHER       : ['-c', '--cipher'],
    PASSWORD     : ['-p', '--password'],
    DEBUG        : ['-l', '--log'],
    RETURN_FILE  : ['-r', '--return'],
    FILE_ENCODING: ['-n', '--encoding'],
    HELP         : ['-h', '--help'],
    VERSION      : ['-v', '--version']
};

/**
 * Options that don't require an argument
 * @type {[*]}
 */
export const OPTIONS_WITH_NO_ARGS = [
    ...OPTION_MAP.DEBUG,
    ...OPTION_MAP.HELP,
    ...OPTION_MAP.VERSION,
    ...OPTION_MAP.RETURN_FILE
];

/**
 * Options that an argument
 * @type {[*]}
 */
export const OPTIONS_WITH_ARGS = [
    ...OPTION_MAP.PASSWORD,
    ...OPTION_MAP.CIPHER,
    ...OPTION_MAP.FILE_ENCODING
];

/**
 * Required options
 * @type {[*]}
 */
export const REQUIRED_OPTIONS = [
    ...OPTION_MAP.ENCRYPT,
    ...OPTION_MAP.DECRYPT
];

/**
 * Combined option arrays
 */
export const OPTION_ARRAY = [
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

export const CLOSE_EVENT = 'close';
export const COMMAND = 'command';
export const PASSWORD = 'password';
export const ENCODING = 'encoding';
export const CIPHER = 'cipher';

export default {
    OPTION_MAP,
    OPTION_ARRAY,
    REQUIRED_OPTIONS,
    OPTIONS_WITH_NO_ARGS,
    OPTIONS_WITH_ARGS,
    SPECIAL_CHARACTERS,
    CRYPTIFY_VERSION,
    DEFAULT_CIPHER,
    EXTENSION,
    CLOSE_EVENT,
    COMMAND,
    PASSWORD,
    ENCODING,
    CIPHER
};
