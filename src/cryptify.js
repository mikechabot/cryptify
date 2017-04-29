/**
 * Cryptify
 *
 * @param options
 * @constructor
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { printHelp, printVersion } from './print';
import { _contains, _getSafePassword, _isValidPassword } from './common/util';
import {
    OPTION_MAP, OPTION_ARRAY, REQUIRED_OPTIONS,
    OPTIONS_WITH_ARGS, OPTIONS_WITH_NO_ARGS, EXTENSION,
    DEFAULT_CIPHER, DEFAULT_ENCODING, CRYPTIFY_VERSION,
    COMMAND, CLOSE_EVENT, PASSWORD,
    ENCODING, CIPHER
} from './common/const';

function Cryptify (options) {
    this.command = undefined;           // Encrypt or decrypt
    this.password = undefined;          // Crypto key
    this.cipher = undefined;            // Cipher algorithm
    this.encoding = undefined;          // Return file encoding
    this.debug = false;                 // Debug log
    this.files = [];                    // List of files to be encrypted or decrypted
    this.options = {};                  // Optional arguments
    this.version = CRYPTIFY_VERSION;    // Version info

    if (options) {
        this.__init(options);
    }
}

Cryptify.prototype.__init = function (args) {
    this.options = this.parseOptionsFromArguments(args, OPTIONS_WITH_NO_ARGS);

    if (this.showVersion()) {
        this.printVersion();
        process.exit();
    }

    if (this.showHelp()) {
        this.printHelp();
        process.exit();
    }

    // Set debug mode
    this.debug = _contains(this.options, OPTION_MAP.DEBUG);

    //  Blank line for spacing
    this.__log('');

    const commands = this.parseOptionsFromArguments(args, REQUIRED_OPTIONS);
    this.validateOptionSyntax(commands, COMMAND);
    this.command = commands[0];
    this.__debug(`Encrypt? ${this.doEncrypt()}`);

    const passwords = this.parseOptionsFromArguments(args, OPTION_MAP.PASSWORD, true);
    this.validateOptionSyntax(passwords, PASSWORD);
    this.password = passwords[0];
    this.__debug(`Set password to "${_getSafePassword(this.getPassword())}"`);
    if (!this.isValidPassword(this.getPassword())) {
        this.__error('Invalid password, see help (--help)');
        process.exit(1);
    }

    const ciphers = this.parseOptionsFromArguments(args, OPTION_MAP.CIPHER, true);
    this.validateOptionSyntax(ciphers, CIPHER, true);
    this.cipher = ciphers[0] || DEFAULT_CIPHER;
    this.__debug(`Set cipher to "${this.getCipher()}"`);
    if (!this.isValidCipher(this.getCipher())) {
        this.__error('Invalid cipher, see help (--help)');
        process.exit(1);
    }

    if (this.doReturnFiles()) {
        const encoding = this.parseOptionsFromArguments(args, OPTION_MAP.FILE_ENCODING, true);
        this.encoding = encoding[0] || DEFAULT_ENCODING;
        this.validateOptionSyntax(encoding, ENCODING, true);
        this.__debug(`Return files? ${this.doReturnFiles()}`);
        this.__debug(`Set encoding to "${this.getEncoding()}"`);
    }

    args.forEach((value, index) => {
        if (!OPTION_ARRAY.includes(value) && !OPTIONS_WITH_ARGS.includes(args[index - 1])) {
            if (!fs.existsSync(value)) {
                this.__error(`No such file: ${value}`);
                process.exit(1);
            } else if (!this.files.includes(value)) {
                this.__info(`Found file "${value}"`);
                this.files.push(value);
            }
        }
    });
};

Cryptify.prototype.parseOptionsFromArguments = function (lookIn, lookFor, getArgument) {
    return lookIn
        .map((value, index) => {
            return lookFor.includes(value)
                ? getArgument ? lookIn[index + 1] : value
                : null;
        })
        .filter(value => value);
};

Cryptify.prototype.validateOptionSyntax = function (list, key, allowNone) {
    if (!allowNone && list.length === 0) {
        this.__error(`Missing required ${key}, see help (--help)`);
        process.exit(1);
    }
    if (list.length > 1) {
        this.__error(`Only single ${key} allowed, see help (--help)`);
        process.exit(1);
    }
};

Cryptify.prototype.cryptify = function () {
    return new Promise((resolve) => {
        let closeEventCount = 0;

        this.__debug(`Processing ${this.getFiles().length} file(s)`);

        this.getFiles().forEach(file => {
            const inputPath = path.join(file);
            const outputPath = path.join(`${file}.${EXTENSION}`);

            this.__debug(`Processing "${inputPath}"`);

            const cipher = this.getCipherFunction()(this.getCipher(), this.getPassword());
            const is = fs.createReadStream(inputPath);
            const os = fs.createWriteStream(outputPath);

            this.__debug(`Piping contents to "${outputPath}"`);
            is.pipe(cipher).pipe(os);

            os.on(CLOSE_EVENT, () => {
                this.__debug(`Renaming "${outputPath}" to "${inputPath}"`);
                fs.renameSync(outputPath, inputPath);

                this.__debug(`Incrementing close event count to ${++closeEventCount}`);
                if (closeEventCount === this.getFiles().length) {
                    this.__info('Processing complete');
                    resolve(
                        this.doEncrypt() || !this.doReturnFiles()
                            ? undefined
                            : this
                                .getFiles()
                                .map(file =>
                                    fs.readFileSync(file, this.getEncoding())
                                )
                    );
                }
            });
        });
    });
};

Cryptify.prototype.getFiles = function () {
    return this.files;
};

Cryptify.prototype.hasFiles = function () {
    return this.files.length > 0;
};

Cryptify.prototype.getPassword = function () {
    return this.password;
};

Cryptify.prototype.getCommand = function () {
    return this.command;
};

Cryptify.prototype.getCipher = function () {
    return this.cipher;
};

Cryptify.prototype.getEncoding = function () {
    return this.encoding;
};

Cryptify.prototype.getOptions = function () {
    return this.options;
};

Cryptify.prototype.getVersion = function () {
    return this.version;
};

Cryptify.prototype.showHelp = function () {
    return _contains(this.getOptions(), OPTION_MAP.HELP);
};

Cryptify.prototype.showVersion = function () {
    return _contains(this.getOptions(), OPTION_MAP.VERSION);
};

Cryptify.prototype.doEncrypt = function () {
    return OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? crypto.createCipher : crypto.createDecipher;
};

Cryptify.prototype.doReturnFiles = function () {
    return _contains(this.getOptions(), OPTION_MAP.RETURN_FILE);
};

Cryptify.prototype.isDebug = function () {
    return this.debug;
};

Cryptify.prototype.isValidCipher = function () {
    return crypto.getCiphers().includes(this.getCipher());
};

Cryptify.prototype.isValidPassword = function () {
    return _isValidPassword(
        this.getPassword()
    );
};

Cryptify.prototype.printHelp = function () {
    printHelp(this);
};

Cryptify.prototype.printVersion = function () {
    printVersion(this);
};

Cryptify.prototype.__debug = function (message) {
    if (this.isDebug()) this.__info(message);
};

Cryptify.prototype.__info = function (message) {
    if (message) this.__log(`    \u2713 ${message}`);
};

Cryptify.prototype.__log = function (message) {
    console.log(message);
};

Cryptify.prototype.__error = function (message) {
    if (message) this.__log(`   \u2718 ${message}`);
};

export default Cryptify;
