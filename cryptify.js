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

function Options(arguments) {
    this.files = [];
    this.arguments = {};
    arguments.forEach((value, index) => {
        if (__includes(CONST.ALLOWED_ARGUMENTS, value)) {
            if (__includes(CONST.TAKES_ARGUMENT, value)) {
                console.log('ADDING ', value, ' WITH ARG ', arguments[index + 1])
                this.arguments[value] = arguments[index + 1];
            } else {
                console.log('THIS DOESNT TAKE AN ARG: ', value)
                this.arguments[value] = undefined;
            }
        } else if (!this.arguments[arguments[index - 1]]) {
            console.log('Adding file name: ', value)
            this.files.push(value)
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

Options.prototype.valid = function() {
    // if (!fs.existsSync(inputPath)) {
    //     console.error(`No such file or directory: ${inputPath}`);
    //     process.exit(1);
    // }
    // function __isValidCipher (cipher) {
    //     if (!cipher) return true;
    //     return crypto.getCiphers().indexOf(cipher) !== -1;
    // }
    //
    // function __isValidPassword (password) {
    //     return password !== null &&
    //         password !== undefined &&
    //         typeof password === 'string' &&
    //         password.trim().length >= 8;
    // }
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
    println('       cryptify (<file>... (-p <password>) (command) [options] | [other])');
    println('       cryptify ./configuration.props -p mySecretKey -e -c aes-256-cbc');
    println('       cryptify ./foo.json ./bar.json -p mySecretKey --decrypt --log');
    println('       cryptify --version');
    println();
    println('   Required Commands:');
    println('       -e --encrypt              Encrypt the file(s)');
    println('       -d --decrypt              Decrypt the file(s)');
    println();
    println('   Optional Arguments:');
    println('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    println('       -k --keep (true|false)    Keep the original file(s) (Default: false)');
    println('       -l --log (true|false)     Log verbose (Default: false)');
    println();
    println('   Other:');
    println('       -h --help                 Show this menu');
    println('       -v --version              Show version');
    println();
    println('   Password Requirements:');
    println('       1) Minimum length: 8');
    println('       2) Requires at least 1 special character');
    println('       3) Combination of uppercase and lowercase');
    exit();
}

function exit(code) {
    code ? process.exit(code) : process.exit();
}

module.exports = function(arguments) {
    if (arguments.length === 0) {
        _printHelpAndExit();
    } else {
        const options = new Options(arguments);
        const validArgs = Object.keys(options.arguments);
        const length = validArgs.length;
        if (length === 0) {
            _printAndExit('Missing required command, see help (--help)');
        } else if (length === 1) {
            if (__includes(CONST.OPTIONS.HELP, validArgs[0])) _printHelpAndExit();
            if (__includes(CONST.OPTIONS.VERSION, validArgs[0])) _printAndExit(CONST.CRYPTIFY_VERSION);
            _printAndExit('Invalid usage, see help (--help)');
        } else if (length >= 2) {
            // Ensure valid password
            const password = options.arguments[CONST.OPTIONS.PASSWORD[0] || CONST.OPTIONS.PASSWORD[1]];
            if (!password) _printAndExit('Missing required password, see help (--help)');
            if (!__isValidPassword(password)) _printAndExit('Invalid password, see help (--help)')
            // Ensure valid files
            if (options.files.length === 0) _printAndExit('Missing required file(s), see help (--help)');
            options.files.forEach(file => {
                if (!fs.existsSync(file)) {
                    _printAndExit(`No such file or directory: ${file}`);
                }
            });

            println();
            console.log('ValidArgs: ', length, validArgs);
            console.log('    Files: ', options.files.length, options.files);
            console.log('   ArgMap: ', JSON.stringify(options.arguments));
            println();

        }
    }
};

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


