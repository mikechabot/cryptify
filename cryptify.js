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
const DEFAULT_OPTIONS = {
    cipher: 'aes-256-cbc-hmac-sha256',
    keep: true
};

function __includes(array, entry) {
    if (!array) return false;
    return array.includes(entry);
}

function __contains(searchIn, searchFor) {
    if (!searchIn || !searchFor) return false;
    return searchFor.some(entry => {
        return __includes(searchIn, entry);
    });
}

function __hasUpperCase(str) {
    if (!str) return false;
    return str.trim().toLowerCase() !== str;
}

function __hasLowerCase(str) {
    if (!str) return false;
    return str.trim().toUpperCase() !== str;
}

function CryptifyConfig(arguments) {
    this.command;
    this.password;
    this.files = [];
    this.options = {};
    console.log(arguments);
    arguments.forEach((value, index) => {
        if (__includes(CONST.REQUIRED_COMMANDS, value)) {
             if (this.command !== undefined) _printAndExit('Only single command allowed, see help (--help)');
             this.command = value;
        } else if (__includes(CONST.OPTIONS.PASSWORD, value)) {
            if (this.password !== undefined) _printAndExit('Only single password allowed, see help (--help)');
            console.log(arguments[index + 1]);
            if (!__isValidPassword(arguments[index + 1])) _printAndExit('Invalid password, see help (--help)')
            this.password = arguments[index + 1]
            println('You just entered a password into a terminal \'history -c\' to clear the bash session');
        } else if (__includes(CONST.OPTIONAL_ARGUMENTS, value)) {
            console.log('ADDING ', value, ' WITH ARG ', arguments[index + 1])
            this.options[value] = arguments[index + 1] || true
        } else if (!this.options[arguments[index - 1]]) {
            console.log('Adding file name: ', value)
            this.files.push(value);
        }
    });
}

function __isValidPassword (password) {
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8 &&
        __contains(password.trim().split(''), CONST.SPECIAL_CHARACTERS) &&
        (__hasUpperCase(password) && __hasLowerCase(password))
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

CryptifyConfig.prototype.isLogVerbose = function () {
    return this.options[CONST.OPTIONS.LOG[0] || CONST.OPTIONS.LOG[1]]
}

CryptifyConfig.prototype.valid = function() {
    // function __isValidCipher (cipher) {
    //     if (!cipher) return true;
    //     return crypto.getCiphers().indexOf(cipher) !== -1;
    // }
    //
}

function println(message) {
    console.log(message || '');
}

function _printAndExit(message) {
    println(`${message}`);
    exit();
}

function _printHelpAndExit(message) {
    message ? (println(), println(`   MSG: ${message}`), println())
            : println();
    println('   Cryptify v1.0 File-based Encryption Utility')
    println('   https://www.npmjs.com/package/cryptify');
    println('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    println();
    println('   Usage:');
    println('       cryptify (<file>... (-p \'<password>\') (command) [options] | [other])');
    println('       cryptify ./configuration.props -p mySecretKey -e -c aes-256-cbc');
    println('       cryptify ./foo.json ./bar.json -p mySecretKey --decrypt --log');
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
    println('   Password Requirements:');
    println('       1) Must wrap password in single quotes');
    println('       2) Minimum length: 8');
    println('       3) Requires at least 1 special character');
    println('       4) Combination of uppercase and lowercase');
    exit();
}

function exit(code) {
    code ? process.exit(code) : process.exit();
}

module.exports = function(arguments) {
    console.log(arguments);
    if (arguments.length === 0) {
        _printHelpAndExit();
    } else {
        const config = new CryptifyConfig(arguments);



        // const files = config.files;
        // const validArgs = Object.keys(config.arguments);
        // const argsLength = validArgs.length;

        // if (argsLength === 0) _printAndExit('Missing required command, see help (--help)');
        // if (files.length === 0 && argsLength === 1) {
        //     if (__includes(CONST.OPTIONS.HELP, validArgs[0])) _printHelpAndExit();
        //     if (__includes(CONST.OPTIONS.VERSION, validArgs[0])) _printAndExit(CONST.CRYPTIFY_VERSION);
        //     _printAndExit('Invalid usage, see help (--help)');
        // }
        //
        // if (argsLength === 0) {
        //     ;
        // } else if (argsLength === 1) {
        //
        //     if (config.files.length > 0) {
        //         __cryptify(config);
        //     } else {
        //
        //     }
        // } else if (argsLength >= 2) {
        //     // Ensure valid password
        //     const password = config.arguments[CONST.OPTIONS.PASSWORD[0] || CONST.OPTIONS.PASSWORD[1]];
        //     if (!password) _printAndExit('Missing required password, see help (--help)');
        //     if (!__isValidPassword(password)) _printAndExit('Invalid password, see help (--help)')
        //     // Ensure valid files
        //     if (config.files.length === 0) _printAndExit('Missing required file(s), see help (--help)');
        //     config.files.forEach(file => {
        //         if (!fs.existsSync(file)) {
        //             _printAndExit(`No such file or directory: ${file}`);
        //         }
        //     });
        //     println();
        //     console.log('ValidArgs: ', argsLength, validArgs);
        //     console.log('    Files: ', config.files.length, config.files);
        //     console.log('   ArgMap: ', JSON.stringify(config.arguments));
        //     println();
        // }
    }
};

function __cryptify(options) {
    console.log('Looks like we should process now?')
    console.log(JSON.stringify(options));
}

/**
 * Encrypt a file
 * @param {string} filePath
 * @param {string} password
 * @param {Object} customOptions
 * @param {string} [customOptions.cipher]
 * @param {string} [customOptions.suffix]
 * @param {boolean} [customOptions.rename]
 */
function encrypt (filePath, password, customOptions) {

    const options = __initOptions(customOptions);
    __validate(filePath, password, options);

    // Derive paths
    const inputPath = path.join(filePath);
    const outputPath = path.join(`${filePath}.${options.suffix}`);

    // Generate cipher and open streams
    const cipher = crypto.createCipher(options.cipher, password.trim());
    const is = fs.createReadStream(inputPath);
    const os = fs.createWriteStream(outputPath);

    // Encrypt files
    is.pipe(cipher).pipe(os);

    // Rename file on stream closure
    os.on(CLOSE_EVENT, function () {
        fs.renameSync(outputPath, inputPath);
    });
}

/**
 * Decrypt a file
 * @param {string} filePath
 * @param {string} password
 * @param {Object} customOptions
 * @param {string} [customOptions.cipher]
 * @param {string} [customOptions.suffix]
 * @param {boolean} [customOptions.rename]
 */
function decrypt (filePath, password, customOptions) {
    const options = __initOptions(customOptions);
    __validate(filePath, password, options);

    // Derive paths
    const inputPath = path.join(filePath);
    const outputPath = path.join(`${filePath}.${options.suffix}`);

    // Generate cipher and open streams
    const cipher = crypto.createDecipher(options.cipher, password.trim());
    const is = fs.createReadStream(inputPath);
    const os = fs.createWriteStream(outputPath);

    // Encrypt files
    is.pipe(cipher).pipe(os);

    // Rename file on stream closure
    os.on(CLOSE_EVENT, function () {
        fs.renameSync(outputPath, inputPath);
    });
}

function __validate (inputPath, password, options) {

    if (!__isValidPassword(password)) {
        console.error(`Password must be a String. Supplied password: "${password}"`);
        exit(1);
    }
    if (!__isValidCipher(options.cipher)) {
        console.error(`Invalid cipher: ${options.cipher}`);
        exit(1);
    }
}

function __initOptions (customOptions) {
    return Object.assign(DEFAULT_OPTIONS, customOptions);
}


