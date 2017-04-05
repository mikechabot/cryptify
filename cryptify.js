/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CRYPTIFY_VERSION = '1.0';

const CLOSE_EVENT = 'close';
const DEFAULT_OPTIONS = {
    cipher: 'aes-256-cbc-hmac-sha256',
    keep: true
};

const ALLOWED_COMMANDS = ['-e', '--encrypt', '-d', '--decrypt'];

function Options(arguments) {

    arguments.forEach((value, index) => {
        if (value && value.startsWith('-')) {
            this[value] = arguments[index + 1];
        }
    });
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

function __printHelpAndExit(message) {
    console.log('');
    if (message) {
        console.log(`   **${message}**`);
        console.log('');
    }
    console.log('   Cryptify v1.0 File-based Encryption Utility')
    console.log('   https://www.npmjs.com/package/cryptify');
    console.log('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    console.log('');
    console.log('   Usage:');
    console.log('       cryptify <file> (-p <password>) (command) [options]');
    console.log('       cryptify ./configuration.props -p mySecretKey -e -c aes-256-cbc');
    console.log('       cryptify ./foo.props ./bar.txt -p mySecretKey --decrypt');
    console.log('');
    console.log('   Commands:');
    console.log('       -e --encrypt              Encrypt the file(s)');
    console.log('       -d --decrypt              Decrypt the file(s)');
    console.log('');
    console.log('   Optional Arguments:');
    console.log('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    console.log('       -k --keep (true|false)    Keep the original file(s) (Default: false)');
    console.log('       -h --help                 Show this menu');
    console.log('       -v --version              Show version');
    console.log('');
    process.exit();
}

function __printVersionAndExit() {
    console.log(CRYPTIFY_VERSION);
}

module.exports = function(arguments) {
    if (arguments.length === 0) {
        __printHelpAndExit();
    } else {
        const passwordIndex = arguments.indexOf('-p');
        if (passwordIndex === -1) {
            __printHelpAndExit();
        } else {
            const files = arguments.splice(0, passwordIndex)
            const options = new Options(arguments);
            const keys = Object.keys(options);
            if (keys.length === 1) {
                const key = keys[0];
                if (key === '-h' || key === '--help') __printHelpAndExit();
                if (key === '-v' || key === '--version') __printVersionAndExit();
                __printHelpAndExit('Missing required command, see help.');
            } else if (keys.length === 2) {
                const password = options['-p' || '--password'];
                console.log('PASSWORD:', password, 'ARGS', arguments)
            }
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
        process.exit(1);
    }
    if (!__isValidCipher(options.cipher)) {
        console.error(`Invalid cipher: ${options.cipher}`);
        process.exit(1);
    }
}

function __initOptions (customOptions) {
    return Object.assign(DEFAULT_OPTIONS, customOptions);
}


