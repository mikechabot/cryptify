/**
 * Cryptify - A file-based encryption utility for Node.js
 * Copyright (C) 2017 Mike Chabot
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { printHelp, printVersion } from './print';
import { _contains, _getSafePassword, _isValidPassword } from './common/util';
import {
    OPTION_MAP, OPTION_ARRAY, REQUIRED_OPTIONS,
    OPTIONS_WITH_ARGS, OPTIONS_WITH_NO_ARGS, EXTENSION,
    DEFAULT_CIPHER, DEFAULT_ENCODING, DEFAULT_COMMAND,
    CRYPTIFY_VERSION, COMMAND, CLOSE_EVENT,
    PASSWORD, ENCODING, CIPHER
} from './common/const';

function Cryptify (files, password, cipher, encoding) {
    this.command = undefined;           // Encrypt or decrypt
    this.password = undefined;          // Crypto key
    this.cipher = undefined;            // Cipher algorithm
    this.encoding = undefined;          // Return file encoding
    this.files = [];                    // List of files to be encrypted or decrypted
    this.version = CRYPTIFY_VERSION;    // Version info

    this.options = {};                  // Optional arguments

    if (files) {
        this.__initFromModule(files, password, cipher, encoding);
    }
}

Cryptify.prototype.__initFromModule = function (files, password, cipher, encoding) {
    this.files = files;
    this.command = DEFAULT_COMMAND;
    this.password = password;
    this.files = !Array.isArray(files) ? [files] : files;
    this.cipher = cipher || DEFAULT_CIPHER;
    this.encoding = encoding || DEFAULT_ENCODING;
};

Cryptify.prototype.__initFromCLI = function (args) {
    this.options = this.parseOptionsFromArguments(args, OPTIONS_WITH_NO_ARGS);

    if (this.showVersion()) {
        this.printVersion();
        process.exit();
    }

    if (this.showHelp()) {
        this.printHelp();
        process.exit();
    }

    //  Blank line for spacing
    this.__log('');

    this.command = this.parseValidateAndSet(args, REQUIRED_OPTIONS, false, COMMAND);
    this.password = this.parseValidateAndSet(args, OPTION_MAP.PASSWORD, true, PASSWORD);
    this.cipher = this.parseValidateAndSet(args, OPTION_MAP.CIPHER, true, CIPHER, true) || DEFAULT_CIPHER;
    this.encoding = this.parseValidateAndSet(args, OPTION_MAP.FILE_ENCODING, true, ENCODING, true) || DEFAULT_ENCODING;

    args.forEach((value, index) => {
        if (!OPTION_ARRAY.includes(value) && !OPTIONS_WITH_ARGS.includes(args[index - 1])) {
            if (!fs.existsSync(value)) {
                this.__error(`No such file: ${value}`, true);
                process.exit(1);
            } else if (!this.files.includes(value)) {
                this.__info(`Found file "${value}"`);
                this.files.push(value);
            }
        }
    });

    this.__info(`Using key "${_getSafePassword(this.getPassword())}"`);
    this.__info(`${this.doEncrypt() ? 'Encrypting' : 'Decrypting'} with ${this.getCipher()}`);

    return this;
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

Cryptify.prototype.parseValidateAndSet = function (lookIn, lookFor, getArgument, optionKey, allowNone) {
    const matches = this.parseOptionsFromArguments(lookIn, lookFor, getArgument);
    this.validateOptionSyntax(matches, optionKey, allowNone);
    return matches[0];
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

Cryptify.prototype.encrypt = function () {
    this.command = OPTION_MAP.ENCRYPT[0];
    return this.__cryptify();
};

Cryptify.prototype.decrypt = function () {
    this.command = OPTION_MAP.DECRYPT[0];
    return this.__cryptify();
};

Cryptify.prototype.cryptifyFromCLI = function () {
    return this.__cryptify();
};

Cryptify.prototype.__cryptify = function () {
    return new Promise((resolve) => {
        let closeEventCount = 0;

        this.__info(`Found ${this.getFiles().length} file(s)`);

        this.getFiles().forEach(file => {
            const inputPath = path.join(file);
            const outputPath = path.join(`${file}.${EXTENSION}`);

            this.__info(`Working on "${inputPath}"`);

            const cipher = this.getCipherFunction()(this.getCipher(), this.getPassword());
            const is = fs.createReadStream(inputPath);
            const os = fs.createWriteStream(outputPath);

            is.pipe(cipher).pipe(os);

            os.on(CLOSE_EVENT, () => {
                closeEventCount++;
                fs.renameSync(outputPath, inputPath);
                if (closeEventCount === this.getFiles().length) {
                    this.__info('Processing complete');
                    resolve(
                        this.getFiles()
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

Cryptify.prototype.__info = function (message) {
    if (message) this.__log(`   \u2713 ${message}`);
};

Cryptify.prototype.__log = function (message) {
    console.log(message);
};

Cryptify.prototype.__error = function (message, space) {
    if (message) {
        if (space) this.__log('');
        this.__log(`   \u2718 ${message}`);
    }
};

export default Cryptify;
