const crypto = require('crypto');
const fs = require('fs');

const CIPHER = 'aes-256-cbc';
const TEMP = 'temp';
const CLOSE_EVENT = 'close';
const STRING_TYPE = 'string';

function __isValidCipher (cipher) {
    if (!cipher) return true;
    return crypto.getCiphers().indexOf(cipher) !== -1;
}

function __isValidPassword (password) {
    if (password === null ||
        password === undefined ||
        typeof password !== STRING_TYPE ||
        password.trim().length === 0
    ) return false;
    return true;
}

module.exports = {
    encrypt (inputPath, password, customCipher) {
        if (!__isValidCipher(customCipher)) {
            console.error(`Invalid cipher: ${customCipher}`);
            process.exit(1);
        }

        if (!fs.existsSync(inputPath)) {
            console.error(`No such file or directory: ${inputPath}`);
            process.exit(1);
        }

        if (!__isValidPassword(password)) {
            console.error(`Password must be a String. Supplied password: "${password}"`);
            process.exit(1);
        }

        const outputPath = `${inputPath}.${TEMP}`;

        // Generate cipher and open streams
        const cipher = crypto.createCipher((CIPHER || customCipher), password.trim());
        const is = fs.createReadStream(inputPath);
        const os = fs.createWriteStream(outputPath);

        // Encrypt files
        is.pipe(cipher).pipe(os);

        // Rename file on stream closure
        os.on(CLOSE_EVENT, function () {
            fs.renameSync(outputPath, inputPath);
        });
    }
};
