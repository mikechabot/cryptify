/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption utility for Node.js
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
    OPTION,
    OPTIONS,
    REQUIRED_OPTIONS,
    OPTIONS_WITH_ARGS,
    OPTIONS_WITH_NO_ARGS,
    EXTENSION,
    SPECIAL_CHARACTERS,
    DEFAULT_CIPHER,
    CRYPTIFY_VERSION
} from './const';

const COMMAND = 'command';
const PASSWORD = 'password';
const CIPHER = 'cipher';
const CLOSE_EVENT = 'close';

function _contains (lookIn, lookFor) {
    if (!lookIn || !lookFor) return false;
    return lookFor.some(entry => {
        return lookIn.includes(entry);
    });
}

function _parseOptions (lookIn, lookFor, getArg) {
    return lookIn
        .map((value, index) => {
            return lookFor.includes(value)
                ? getArg ? lookIn[index + 1] : value
                : null;
        })
        .filter(value => value);
}

function _verifyOnlyOne (list, key, allowNone) {
    if (!allowNone && list.length === 0) _printAndExit(`Missing required ${key}, see help (--help)'`);
    if (list.length > 1) _printAndExit(`Only single ${key} allowed, see help (--help)'`);
}

function _isValidCipher (cipher) {
    return crypto.getCiphers().includes(cipher);
}

function _isValidPassword (password) {
    function _hasUpperCase (str) {
        if (!str) return false;
        return str.trim().toLowerCase() !== str;
    }
    function _hasLowerCase (str) {
        if (!str) return false;
        return str.trim().toUpperCase() !== str;
    }
    function _hasNumber (str) {
        if (!str) return false;
        return /\d/.test(str);
    }
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8 &&
        _contains(password.trim().split(''), SPECIAL_CHARACTERS) &&
        _hasNumber(password) &&
        _hasUpperCase(password) &&
        _hasLowerCase(password);
}

function CryptifyConfig (configOptions) {
    this.command = undefined;       // Encrypt or decrypt
    this.password = undefined;      // Crypto key
    this.cipher = undefined;        // Cipher algorithm
    this.debug = false;             // Debug log
    this.files = [];                // List of files to be encrypted or decrypted
    this.options = {};              // Optional arguments

    this.__init(configOptions);
}

CryptifyConfig.prototype.__init = function (configOptions) {
    this.options = _parseOptions(configOptions, OPTIONS_WITH_NO_ARGS);

    // Display version and exit
    if (this.showVersion()) {
        _printAndExit(CRYPTIFY_VERSION);
    }

    // Display help and exit
    if (this.showHelp()) {
        _printHelpAndExit();
    }

    // Set debug mode
    this.debug = _contains(this.options, OPTION.DEBUG);
    this.log();

    const commands = _parseOptions(configOptions, REQUIRED_OPTIONS);
    _verifyOnlyOne(commands, COMMAND);
    this.command = commands[0];
    this.log(`Do encrypt? ${this.doEncrypt()}`);

    const passwords = _parseOptions(configOptions, OPTION.PASSWORD, true);
    _verifyOnlyOne(passwords, PASSWORD);
    this.password = passwords[0];
    this.log(`Set password to '${this.getPassword()}'`);

    const ciphers = _parseOptions(configOptions, OPTION.CIPHER, true);
    _verifyOnlyOne(ciphers, CIPHER, true);
    this.cipher = ciphers[0] || DEFAULT_CIPHER;
    this.log(`Set cipher to '${this.getCipher()}'`);

    configOptions.forEach((value, index) => {
        if (!OPTIONS.includes(value) &&
            !OPTIONS_WITH_ARGS.includes(configOptions[index - 1])
        ) {
            if (!fs.existsSync(value)) {
                _printAndExit(`No such file: ${value}`);
            } else if (!this.files.includes(value)) {
                this.log(`Found file '${value}'...`);
                this.files.push(value);
            }
        }
    });

    if (!_isValidPassword(this.getPassword())) _printAndExit('Invalid password, see help (--help)');
    if (!_isValidCipher(this.getCipher())) _printAndExit('Invalid cipher, see help (--help)');
};

CryptifyConfig.prototype.getFiles = function () {
    return this.files;
};

CryptifyConfig.prototype.hasFiles = function () {
    return this.files.length > 0;
};

CryptifyConfig.prototype.getPassword = function () {
    return this.password;
};

CryptifyConfig.prototype.getCommand = function () {
    return this.command;
};

CryptifyConfig.prototype.getCipher = function () {
    return this.cipher;
};

CryptifyConfig.prototype.getOptions = function () {
    return this.options;
};

CryptifyConfig.prototype.showHelp = function () {
    return _contains(this.options, OPTION.HELP);
};

CryptifyConfig.prototype.showVersion = function () {
    return _contains(this.options, OPTION.VERSION);
};

CryptifyConfig.prototype.doEncrypt = function () {
    return OPTION.ENCRYPT.includes(this.command);
};

CryptifyConfig.prototype.doReturnFiles = function () {
    return _contains(this.options, OPTION.RETURN_FILE);
};

CryptifyConfig.prototype.isDebug = function () {
    return this.debug;
};

CryptifyConfig.prototype.log = function (message) {
    if (this.isDebug()) {
        !message
            ? console.log('')
            : console.log(`   ✓ ${message}`);
    }
};

function _println (message) {
    console.log(message || '');
}

function _printAndExit (message) {
    _println(`${message}`);
    _exit();
}

function _exit (code) {
    code ? process.exit(code) : process.exit();
}

function _printHelpAndExit () {
    _println();
    _println(`   Cryptify v${CRYPTIFY_VERSION} File-based Encryption Utility`);
    _println('   https://www.npmjs.com/package/cryptify');
    _println('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    _println();
    _println('   Usage:');
    _println('       cryptify (<file>... (-p <password>) (command) [options] | [other])');
    _println('       cryptify ./configuration.props -p \'mySecretKey\' -e -c aes-256-cbc');
    _println('       cryptify ./foo.json ./bar.json -p \'mySecretKey\' --decrypt --log');
    _println('       cryptify --version');
    _println();
    _println('   Required Commands:');
    _println('       -e --encrypt              Encrypt the file(s)');
    _println('       -d --decrypt              Decrypt the file(s)');
    _println();
    _println('   Required Arguments:');
    _println('       -p --password             Cryptographic key');
    _println();
    _println('   Optional Arguments:');
    _println('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    _println('       -k --keep                 Keep the original file(s)');
    _println('       -l --log                  Enable debug log');
    _println('       -r --return               Return file contents on finish');
    _println('       -h --help                 Show this menu');
    _println('       -v --version              Show version');
    _println();
    _println('   Required Password Wrapping:');
    _println('       Bash                      single-quotes');
    _println('       Command Prompt            double-quotes');
    _println('       PowerShell                single-quotes');
    _println();
    _println('   Password Requirements:');
    _println('       1) Minimum length: 8 characters');
    _println('       2) Must contain at least 1 special character');
    _println('       3) Must contain at least 1 numeric character');
    _println('       4) Must contain a combination of uppercase and lowercase');
    _exit();
}

function _printPasswordWarning () {
    _println();
    _println('  +----------------------------------------------------------------------+');
    _println('  |   ** NOTE: You just entered a password key into a shell session **   |');
    _println('  |           Strongly consider clearing your session history            |');
    _println('  |        https://www.npmjs.com/package/cryptify#recommendations        |');
    _println('  +----------------------------------------------------------------------+');
    _println();
}

module.exports = function (configArguments) {
    if (configArguments.length === 0) {
        _printHelpAndExit();
    } else {
        const config = new CryptifyConfig(configArguments);
        _printPasswordWarning();
        _cryptify(config)
            .then(() => {
                if (config.doReturnFiles()) {
                    const contents = [];
                    config.getFiles().forEach(file => {
                        contents.push(fs.readFileSync(file, 'utf8'));
                    });
                    return contents;
                }
            });
    }
};

/**
 * Encrypt or decrypt a set of files
 * @param options
 * @private
 */
function _cryptify (options) {
    return new Promise((resolve) => {
        let closeEventCount = 0;
        options.getFiles().forEach(file => {
            // Derive paths
            const inputPath = path.join(file);
            const outputPath = path.join(`${file}.${EXTENSION}`);
            // Encrypt or decrypt
            const cipherFunc = options.doEncrypt()
                ? crypto.createCipher
                : crypto.createDecipher;
            // Generate cipher and open streams
            const cipher = cipherFunc(options.getCipher(), options.getPassword());
            const is = fs.createReadStream(inputPath);
            const os = fs.createWriteStream(outputPath);
            // Perform operation
            is.pipe(cipher).pipe(os);
            // Rename on close
            os.on(CLOSE_EVENT, function () {
                fs.renameSync(outputPath, inputPath);
                closeEventCount++;
                if (closeEventCount === options.getFiles().length) {
                    resolve(closeEventCount);
                }
            });
        });
    });
}
