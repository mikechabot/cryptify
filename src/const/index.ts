import { CommandMode, Commands, Options, DefaultValues } from './types';

export const IV_BLOCK_LENGTH = 16;

/**
 * List of available commands
 * @type {({description: string, command: string}|{description: string, command: string})[]}
 */
export const COMMANDS: Commands = [
  { mode: CommandMode.Encrypt, description: 'Encrypt files(s)' },
  { mode: CommandMode.Decrypt, description: 'Decrypt files(s)' },
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

export const options: Options = {
  version: {
    label: '-v, --version',
    description: 'Display the current version',
  },
  help: {
    label: '-h, --help',
    description: 'Display help for the command',
  },
  list: {
    label: '-l, --list',
    description: 'List available ciphers',
  },
  password: {
    label: '-p, --password <password>',
    description: 'Cryptographic key',
  },
  loose: {
    label: '-o, --loose',
    description: 'Bypass password requirements',
    defaultValue: false,
  },
  cipher: {
    label: '-c, --cipher <cipher>',
    description: 'Cipher algorithm',
    defaultValue: 'aes-256-cbc',
  },
  silent: {
    label: '-s, --silent',
    description: 'Silence informational display',
    defaultValue: false,
  },
  encoding: {
    label: '-e, --encoding <encoding>',
    description: 'Character encoding',
    defaultValue: 'utf8',
  },
  helpCommand: {
    label: 'help <command>',
    description: 'Display help for the command',
  },
};

/**
 * Default parameters
 * @type {{ENCODING: string, HASH_ALGORITHM: string, CIPHER_ALGORITHM: string, EXTENSION: string}}
 */
export const DEFAULT: DefaultValues = {
  CIPHER_ALGORITHM: 'aes-256-cbc',
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
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  '{',
  '|',
  '}',
  '~',
];

export const SupportedCiphers = [
  'aes-128-cbc',
  'aes-128-cbc-hmac-sha1',
  'aes-128-cbc-hmac-sha256',
  'aes-128-cfb',
  'aes-128-cfb1',
  'aes-128-cfb8',
  'aes-128-ctr',
  'aes-128-ofb',
  'aes-192-cbc',
  'aes-192-cfb',
  'aes-192-cfb1',
  'aes-192-cfb8',
  'aes-192-ctr',
  'aes-192-ofb',
  'aes-256-cbc',
  'aes-256-cbc-hmac-sha1',
  'aes-256-cbc-hmac-sha256',
  'aes-256-cfb',
  'aes-256-cfb1',
  'aes-256-cfb8',
  'aes-256-ctr',
  'aes-256-ofb',
  'aes128',
  'aes192',
  'aes256',
  'aria-128-cbc',
  'aria-128-cfb',
  'aria-128-cfb1',
  'aria-128-cfb8',
  'aria-128-ctr',
  'aria-128-ofb',
  'aria-192-cbc',
  'aria-192-cfb',
  'aria-192-cfb1',
  'aria-192-cfb8',
  'aria-192-ctr',
  'aria-192-ofb',
  'aria-256-cbc',
  'aria-256-cfb',
  'aria-256-cfb1',
  'aria-256-cfb8',
  'aria-256-ctr',
  'aria-256-ofb',
  'aria128',
  'aria192',
  'aria256',
  'camellia-128-cbc',
  'camellia-128-cfb',
  'camellia-128-cfb1',
  'camellia-128-cfb8',
  'camellia-128-ctr',
  'camellia-128-ofb',
  'camellia-192-cbc',
  'camellia-192-cfb',
  'camellia-192-cfb1',
  'camellia-192-cfb8',
  'camellia-192-ctr',
  'camellia-192-ofb',
  'camellia-256-cbc',
  'camellia-256-cfb',
  'camellia-256-cfb1',
  'camellia-256-cfb8',
  'camellia-256-ctr',
  'camellia-256-ofb',
  'camellia128',
  'camellia192',
  'camellia256',
  'chacha20',
];
