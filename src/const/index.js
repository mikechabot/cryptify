export const IV_BLOCK_LENGTH = 16;

/**
 * Map of stream events
 * @type {{DATA: string, ERROR: string, END: string, CLOSE: string}}
 */
export const STREAM_EVENT = {
    ERROR: 'error',
    CLOSE: 'close',
    DATA: 'data',
    END: 'end',
};

/**
 * Command map
 * @type {{DECRYPT: string, ENCRYPT: string}}
 */
export const COMMAND_MODE = {
    ENCRYPT: 'encrypt',
    DECRYPT: 'decrypt'
};

/**
 * List of available commands
 * @type {({description: string, command: string}|{description: string, command: string})[]}
 */
export const COMMANDS = [
    { mode: COMMAND_MODE.ENCRYPT, description: 'Encrypt files(s)' },
    { mode: COMMAND_MODE.DECRYPT, description: 'Decrypt files(s)' }
];

/**
 * Define the options for commander
 * @type {{
 *  version: {description: string, label: string},
 *  cipher: {description: string, label: string},
 *  help: {description: string, label: string},
 *  password: {description: string, label: string},
 *  list: {description: string, label: string},
 *  encoding: {description: string, label: string}
 *  helpCommand: {description: string, label: string}
 * }}
 */
export const options = {
    version: {
        label: '-v, --version',
        description: 'Display the current version'
    },
    help: {
        label: '-h, --help',
        description: 'Display help for the command'
    },
    list: {
        label: '-l, --list',
        description: 'List available ciphers'
    },
    password: {
        label: '-p, --password <password>',
        description: 'Cryptographic key'
    },
    cipher: {
        label: '-c, --cipher <cipher>',
        description: 'Cipher algorithm'
    },
    encoding: {
        label: '-e, --encoding <encoding>',
        description: 'Character encoding',
        defaultValue: 'utf8'
    },
    helpCommand: {
        label: 'help <command>',
        description: 'Display help for the command'
    },
};

/**
 * Default parameters
 * @type {{ENCODING: string, HASH_ALGORITHM: string, CIPHER_ALGORITHM: string, EXTENSION: string}}
 */
export const DEFAULT = {
    CIPHER_ALGORITHM: 'aes-256-cbc-hmac-sha256', // aes-256-cbc
    ENCODING: 'utf8',
    EXTENSION: 'tmp',
    HASH_ALGORITHM: 'sha256',
};

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

