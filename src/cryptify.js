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
import CryptifyException from './common/exception';
import { printHelp, printVersion, printCiphers } from './print';
import {
    someInclude, getSafePassword, isValidPassword,
    isValidCipher, parseOptionsFromArguments, parseOptionFromArguments,
    parseFilesFromArguments
} from './common/util';
import {
    DEFAULTS, OPTION_MAP, REQUIRED_OPTIONS,
    OPTIONS_WITH_NO_ARGS
} from './common/const';

function Cryptify (files, password, cipher, encoding) {
    if (!crypto) {
        throw new CryptifyException('crypto not found');
    }

    this.password = password;                               // Crypto key
    this.cipher = cipher || DEFAULTS.CIPHER;                // Cipher algorithm
    this.encoding = encoding || DEFAULTS.ENCODING;          // Return file encoding
    this.files = !Array.isArray(files) ? [files] : files;   // List of files to be encrypted or decrypted

    this.__validateFiles(this.getFiles());
    this.__validatePassword(this.getPassword());
    this.__validateCipher(this.getCipher());
}

Cryptify.__initFromCLI = function (args) {
    let instance;
    try {
        if (!crypto) {
            throw new CryptifyException('crypto not found');
        }

        if (!args || !args.length) {
            printHelp();
            return;
        }

        const optionsWithNoArgs = parseOptionsFromArguments(args, OPTIONS_WITH_NO_ARGS);
        const command = parseOptionFromArguments(args, REQUIRED_OPTIONS, false);
        const password = parseOptionFromArguments(args, OPTION_MAP.PASSWORD, true);
        const cipher = parseOptionFromArguments(args, OPTION_MAP.CIPHER, true);
        const encoding = parseOptionFromArguments(args, OPTION_MAP.FILE_ENCODING, true);

        if (someInclude(optionsWithNoArgs, OPTION_MAP.VERSION)) {
            printVersion();
            return;
        }

        if (someInclude(optionsWithNoArgs, OPTION_MAP.HELP)) {
            printHelp();
            return;
        }

        if (someInclude(optionsWithNoArgs, OPTION_MAP.LIST_CIPHERS)) {
            printCiphers();
            return;
        }

        if (!command || !password) {
            throw new CryptifyException('Invalid usage, see --help');
        }

        const files = parseFilesFromArguments(args);
        if (files.length < 1) {
            throw new CryptifyException('Must specify a file or files, see --help');
        }

        instance = new Cryptify(files, password, cipher, encoding);
        instance.setCommand(command);
    } catch (error) {
        console.log(''); // Blank line for spacing
        console.log(`   \u2718 ${error.message}`);
    }

    return instance;
};

Cryptify.prototype.__validateFiles = function (files) {
    if (!files ||
        (typeof files !== 'string' &&
        (Array.isArray(files) && !files.every(file => typeof file === 'string')))) {
        throw new CryptifyException('Must specify path(s) to file(s), see --help');
    }
    files.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new CryptifyException(`No such file: ${file}`);
        }
    });
};

Cryptify.prototype.__validatePassword = function (password) {
    if (!password ||
        typeof password !== 'string' ||
        !isValidPassword(password)
    ) {
        throw new CryptifyException('Invalid password, see --help');
    }
};

Cryptify.prototype.__validateCipher = function (cipher) {
    if (!cipher ||
        typeof cipher !== 'string' ||
        !isValidCipher(cipher)
    ) {
        throw new CryptifyException(`Invalid cipher: ${cipher}, see --help`);
    }
};

Cryptify.prototype.__generateCipher = function () {
    return this.getCipherFunction()(this.getCipher(), this.getPassword());
};

Cryptify.prototype.encrypt = function () {
    this.setCommand(OPTION_MAP.ENCRYPT[0]);
    return this.__cryptify();
};

Cryptify.prototype.decrypt = function () {
    this.setCommand(OPTION_MAP.DECRYPT[0]);
    return this.__cryptify();
};

Cryptify.prototype.__cryptify = function () {
    function __handleError (reject, error) {
        if (error && error.message) {
            return reject(new CryptifyException(error.message));
        } else {
            return reject(new CryptifyException('An unknown error has occurred'));
        }
    }

    return new Promise((resolve, reject) => {
        let closeEventCount = 0;
        const numberOfFiles = this.getFiles().length;

        this.__log(''); // Blank line for spacing
        this.__info(`${this.doEncrypt() ? 'Encrypting' : 'Decrypting'} ${numberOfFiles} file(s) with ${getSafePassword(this.getPassword())}`);
        this.__info(`Using ${this.getCipher()} cipher `);
        this.__info(`Using ${this.getEncoding()} encoding`);

        this.getFiles().forEach(file => {
            const inputPath = path.join(file);
            const outputPath = path.join(`${file}.${DEFAULTS.EXTENSION}`);

            this.__info(`Working on "${inputPath}"`);

            const rs = fs.createReadStream(inputPath);
            const ws = fs.createWriteStream(outputPath);

            rs
                .on('error', __handleError.bind(null, reject))
                .pipe(this.__generateCipher())
                .on('error', __handleError.bind(null, reject))
                .pipe(ws)
                .on('error', __handleError.bind(null, reject))
                .on('close', () => {
                    closeEventCount++;
                    fs.renameSync(outputPath, inputPath);
                    if (closeEventCount === numberOfFiles) {
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

Cryptify.prototype.getPassword = function () {
    return this.password;
};

Cryptify.prototype.setCommand = function (command) {
    this.command = command;
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

Cryptify.prototype.doEncrypt = function () {
    return OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? crypto.createCipher : crypto.createDecipher;
};

Cryptify.prototype.__info = function (message) {
    if (message) this.__log(`   \u2713 ${message}`);
};

Cryptify.prototype.__log = function (message) {
    console.log(message);
};

Cryptify.prototype.__error = function (message) {
    if (message) this.__log(`   \u2718 ${message}`);
};

export default Cryptify;
