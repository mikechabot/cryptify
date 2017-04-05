const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CLOSE_EVENT = 'close';
const DEFAULT_OPTIONS = {
    cipher: 'aes-256-cbc-hmac-sha256',
    rename: true,
    suffix: 'temp'
};

function listArgs() {
    process.argv.forEach((val, index, array) => {
        console.log(index + ': ' + val);
    });
}
module.exports = listArgs;

/**
 * Encrypt a file
 * @param {string} inputPath
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
 * @param {string} inputPath
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
    if (!fs.existsSync(inputPath)) {
        console.error(`No such file or directory: ${inputPath}`);
        process.exit(1);
    }
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

function __isValidCipher (cipher) {
    if (!cipher) return true;
    return crypto.getCiphers().indexOf(cipher) !== -1;
}

function __isValidPassword (password) {
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8;
}
