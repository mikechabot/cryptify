/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CONST = require('./const');

const CLOSE_EVENT = 'close';
const DEFAULT_CIPHER = 'aes-256-cbc-hmac-sha256';
const TEMP = 'temp';

function _includes(array, entry) {
    if (!array) return false;
    return array.includes(entry);
}

function _contains(searchIn, searchFor) {
    if (!searchIn || !searchFor) return false;
    return searchFor.some(entry => {
        return _includes(searchIn, entry);
    });
}

function _isValidCipher (cipher) {
    return crypto.getCiphers().includes(cipher);
}

function _isValidPassword (password) {
    function __hasUpperCase(str) {
        if (!str) return false;
        return str.trim().toLowerCase() !== str;
    }
    function __hasLowerCase(str) {
        if (!str) return false;
        return str.trim().toUpperCase() !== str;
    }
    function __hasNumber(str) {
        if (!str) return false;
        return /\d/.test(str);
    }
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8 &&
        _contains(password.trim().split(''), CONST.SPECIAL_CHARACTERS) &&
        __hasNumber(password) &&
        (__hasUpperCase(password) && __hasLowerCase(password))
}

function CryptifyConfig(arguments) {
    this.command;
    this.password;
    this.cipher;
    this.files = [];
    this.options = {};
    // Parse arguments from CLI
    arguments.forEach((value, index) => {
        if (_includes(CONST.REQUIRED_COMMANDS, value)) {
            this.command !== undefined
                ? _printAndExit('Only single command allowed, see help (--help)')
                : this.command = value
        } else if (_includes(CONST.OPTIONS.PASSWORD, value)) {
            if (this.password !== undefined) _printAndExit('Only single password allowed, see help (--help)');
            if (!_isValidPassword(arguments[index + 1])) _printAndExit('Invalid password, see help (--help)')
            this.password = arguments[index + 1];
        } else if (_includes(CONST.OPTIONS.CIPHER, value)) {
            if (this.cipher !== undefined) _printAndExit('Only single cipher allowed, see help (--help)');
            if (!_isValidCipher(arguments[index + 1])) _printAndExit('Invalid cipher, see help (--help)');
            this.cipher = arguments[index + 1];
        } else if (_includes(CONST.OPTIONAL_ARGUMENTS_NO_ARGS, value)) {
            this.options[value] = true;
        } else if (
            !_includes(CONST.OPTIONS.PASSWORD, arguments[index - 1]) &&
            !this.options[arguments[index - 1]]
        ) {
            if (!fs.existsSync(value)) {
                _printAndExit(`No such file or directory: ${value}`);
            } else {
                this.files.push(value);
            }
        }
    });
}

CryptifyConfig.prototype.getFiles = function() {
    return this.files;
}

CryptifyConfig.prototype.getPassword = function() {
    return this.password;
}

CryptifyConfig.prototype.getCommand = function() {
    return this.command;
}

CryptifyConfig.prototype.getOptions = function() {
    return this.options;
}

CryptifyConfig.prototype.doEncrypt = function () {
    return this.command === CONST.OPTIONS.ENCRYPT[0] ||
        this.command === CONST.OPTIONS.ENCRYPT[1];
}

CryptifyConfig.prototype.isVerbose = function () {
    return this.options[CONST.OPTIONS.LOG[0] || CONST.OPTIONS.LOG[1]] === true;
}

function println(message) {
    console.log(message || '');
}

function _printAndExit(message) {
    println(`${message}`);
    __exit();
}

function __exit(code) {
    code ? process.exit(code) : process.exit();
}

function _printHelpAndExit() {
    println()
    println('   Cryptify v1.0 File-based Encryption Utility')
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
    println('       1) Minimum length: 8');
    println('       2) Requires at least 1 special character');
    println('       2) Requires at least 1 numeric character');
    println('       4) Combination of uppercase and lowercase');
    __exit();
}

function _printPasswordWarning() {
    println();
    println('  +----------------------------------------------------------------------+');
    println('  |   ** NOTE: You just entered a password key into a shell session **   |');
    println('  |           Strongly consider clearing your session history            |')
    println('  |        https://github.com/mikechabot/cryptify#recommendations        |');
    println('  +----------------------------------------------------------------------+');
    println();
}

module.exports = function(arguments) {
    if (arguments.length === 0) {
        _printHelpAndExit();
    } else {
        const config = new CryptifyConfig(arguments);
        _printPasswordWarning();
        _cryptify(config);
    }
};

function _cryptify(options) {
    options.doEncrypt()
        ? _encrypt(options, options.cipher || DEFAULT_CIPHER)
        : _decrypt(options, options.cipher || DEFAULT_CIPHER);
}

/**
 * Encrypt a file
 * @param {Object} options
 * @private
 */
function _encrypt (options, cipherAlgo) {
    options.files.forEach(file => {
        // Derive paths
        const inputPath = path.join(file);
        const outputPath = path.join(`${file}.${TEMP}`);
        // Generate cipher and open streams
        const cipher = crypto.createCipher(cipherAlgo, options.password);
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
function _decrypt (options, cipherAlgo) {
    options.files.forEach(file => {
        // Derive paths
        const inputPath = path.join(file);
        const outputPath = path.join(`${file}.${TEMP}`);
        // Generate cipher and open streams
        const cipher = crypto.createDecipher(cipherAlgo, options.password);
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
