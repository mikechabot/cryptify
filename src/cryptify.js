/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const CONST = require('./const');

const COMMAND = 'command';
const PASSWORD = 'password';
const CIPHER = 'cipher';
const CLOSE_EVENT = 'close';
const DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
const TEMP = 'temp';

function _includes (array, entry) {
    if (!array) return false;
    return array.includes(entry);
}

function _contains (searchIn, searchFor) {
    if (!searchIn || !searchFor) return false;
    return searchFor.some(entry => {
        return _includes(searchIn, entry);
    });
}

function _getOptionsFromCLI (searchIn, searchFor, getArgument) {
    return searchIn.map((value, index) => {
        if (searchFor.includes(value)) {
            return getArgument ? searchIn[index + 1] : value;
        }
    }).filter(value => value);
}

function _verifyOnlyOne (list, key, allowNone) {
    if (!allowNone && list.length === 0) _printAndExit(`Missing required ${key}, see help (--help)'`);
    if (list.length > 1) _printAndExit(`Only single ${key} allowed, see help (--help)'`);
}

function _isValidCipher (cipher) {
    return crypto.getCiphers().includes(cipher);
}

function _isValidPassword (password) {
    function __hasUpperCase (str) {
        if (!str) return false;
        return str.trim().toLowerCase() !== str;
    }
    function __hasLowerCase (str) {
        if (!str) return false;
        return str.trim().toUpperCase() !== str;
    }
    function __hasNumber (str) {
        if (!str) return false;
        return /\d/.test(str);
    }
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8 &&
        _contains(password.trim().split(''), CONST.SPECIAL_CHARACTERS) &&
        __hasNumber(password) &&
        __hasUpperCase(password) &&
        __hasLowerCase(password);
}

function CryptifyConfig (configArguments) {
    this.command = undefined;
    this.password = undefined;
    this.cipher = undefined;
    this.files = [];
    this.options = {};

    this.options = _getOptionsFromCLI(configArguments, CONST.OPTIONS_DO_NOT_TAKE_ARGUMENT);
    const commands = _getOptionsFromCLI(configArguments, CONST.REQUIRED_COMMANDS);
    const passwords = _getOptionsFromCLI(configArguments, CONST.OPTIONS.PASSWORD, true);
    const ciphers = _getOptionsFromCLI(configArguments, CONST.OPTIONS.CIPHER, true);

    // Parse file names from CLI
    configArguments.forEach((value, index) => {
        if (!_includes(CONST.REQUIRED_COMMANDS, value) &&
            !_includes(CONST.OPTIONS.PASSWORD, value) &&
            !_includes(CONST.OPTIONS.CIPHER, value) &&
            !_includes(CONST.OPTIONS_DO_NOT_TAKE_ARGUMENT, value) &&
            !_includes(CONST.OPTIONS_TAKE_ARGUMENT, configArguments[index - 1])
        ) {
            if (!fs.existsSync(value)) {
                _printAndExit(`No such file: ${value}`);
            } else if (!this.files.includes(value)) {
                this.files.push(value);
            }
        }
    });

    if (this.showVersion()) _printAndExit(CONST.CRYPTIFY_VERSION);
    if (this.showHelp()) _printHelpAndExit();

    _verifyOnlyOne(commands, COMMAND);
    _verifyOnlyOne(passwords, PASSWORD);
    _verifyOnlyOne(ciphers, CIPHER, true);

    this.command = commands[0];
    this.password = passwords[0];
    this.cipher = ciphers[0] || DEFAULT_CIPHER;

    if (!_isValidPassword(this.getPassword())) _printAndExit('Invalid password, see help (--help)');
    if (!_isValidCipher(this.getCipher())) _printAndExit('Invalid cipher, see help (--help)');
}

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
    return _contains(this.options, CONST.OPTIONS.HELP);
};

CryptifyConfig.prototype.showVersion = function () {
    return _contains(this.options, CONST.OPTIONS.VERSION);
};

CryptifyConfig.prototype.doEncrypt = function () {
    return this.command === CONST.OPTIONS.ENCRYPT[0] ||
        this.command === CONST.OPTIONS.ENCRYPT[1];
};

CryptifyConfig.prototype.isVerbose = function () {
    return this.command === CONST.OPTIONS.LOG[0] ||
        this.command === CONST.OPTIONS.LOG[1];
};

function println (message) {
    console.log(message || '');
}

function _printAndExit (message) {
    println(`${message}`);
    __exit();
}

function __exit (code) {
    code ? process.exit(code) : process.exit();
}

function _printHelpAndExit () {
    println();
    println(`   Cryptify v${CONST.CRYPTIFY_VERSION} File-based Encryption Utility`);
    println('   https://www.npmjs.com/package/cryptify');
    println('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    println();
    println('   Usage:');
    println('       cryptify (<file>... (-p <password>) (command) [options] | [other])');
    println('       cryptify ./configuration.props -p \'mySecretKey\' -e -c aes-256-cbc');
    println('       cryptify ./foo.json ./bar.json -p \'mySecretKey\' --decrypt --log');
    println('       cryptify --version');
    println();
    println('   Required Commands:');
    println('       -e --encrypt              Encrypt the file(s)');
    println('       -d --decrypt              Decrypt the file(s)');
    println();
    println('   Required Arguments:');
    println('       -p --password             Cryptographic key');
    println();
    println('   Optional Arguments:');
    println('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    println('       -k --keep                 Keep the original file(s)');
    println('       -l --log                  Log verbose');
    println('       -h --help                 Show this menu');
    println('       -v --version              Show version');
    println();
    println('   Required Password Wrapping:');
    println('       Bash                      single-quotes');
    println('       Command Prompt            double-quotes');
    println('       PowerShell                single-quotes');
    println();
    println('   Password Requirements:');
    println('       1) Minimum length: 8 characters');
    println('       2) Must contain at least 1 special character');
    println('       3) Must contain at least 1 numeric character');
    println('       4) Must contain a combination of uppercase and lowercase');
    __exit();
}

function _printPasswordWarning () {
    println();
    println('  +----------------------------------------------------------------------+');
    println('  |   ** NOTE: You just entered a password key into a shell session **   |');
    println('  |           Strongly consider clearing your session history            |');
    println('  |        https://github.com/mikechabot/cryptify#recommendations        |');
    println('  +----------------------------------------------------------------------+');
    println();
}

module.exports = function (configArguments) {
    if (configArguments.length === 0) {
        _printHelpAndExit();
    } else {
        const config = new CryptifyConfig(configArguments);
        _printPasswordWarning();
        _cryptify(config);
    }
};

function _cryptify (options) {
    options.doEncrypt()
        ? _encrypt(options, options.getCipher() || DEFAULT_CIPHER)
        : _decrypt(options, options.getCipher() || DEFAULT_CIPHER);
}

/**
 * Encrypt a file
 * @param {Object} options
 * @private
 */
function _encrypt (options, cipherAlgorithm) {
    options.getFiles().forEach(file => {
        // Derive paths
        const inputPath = path.join(file);
        const outputPath = path.join(`${file}.${TEMP}`);
        // Generate cipher and open streams
        const cipher = crypto.createCipher(cipherAlgorithm, options.getPassword());
        const is = fs.createReadStream(inputPath);
        const os = fs.createWriteStream(outputPath);
        // Encrypt files
        is.pipe(cipher).pipe(os);
        // Rename file on stream closure
        os.on(CLOSE_EVENT, function () {
            fs.renameSync(outputPath, inputPath);
        });
    });
}

/**
 * Decrypt a file
 * @param {Object} options
 * @private
 */
function _decrypt (options, cipherAlgorithm) {
    options.getFiles().forEach(file => {
        // Derive paths
        const inputPath = path.join(file);
        const outputPath = path.join(`${file}.${TEMP}`);
        // Generate cipher and open streams
        const cipher = crypto.createDecipher(cipherAlgorithm, options.getPassword());
        const is = fs.createReadStream(inputPath);
        const os = fs.createWriteStream(outputPath);
        // Encrypt files
        is.pipe(cipher).pipe(os);
        // Rename file on stream closure
        os.on(CLOSE_EVENT, function () {
            fs.renameSync(outputPath, inputPath);
        });
    });
}
