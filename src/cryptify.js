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
import CryptifyException from './common/exception';
import {
    deepFind, getSafePassword, isValidPassword,
    parseOptionsFromArguments, parseOptionFromArguments, parseFilesFromArguments
} from './common/util';
import {
    OPTION_MAP, OPTION_ARRAY, REQUIRED_OPTIONS,
    OPTIONS_WITH_ARGS, OPTIONS_WITH_NO_ARGS, EXTENSION,
    DEFAULT_CIPHER, DEFAULT_ENCODING, DEFAULT_COMMAND,
    CRYPTIFY_VERSION, COMMAND, CLOSE_EVENT,
    PASSWORD, ENCODING, CIPHER
} from './common/const';

function Cryptify (files, password, cipher, encoding) {
    this.command = undefined;           // Encrypt or decrypt
    this.password = password;          // Crypto key
    this.cipher = cipher;            // Cipher algorithm
    this.encoding = encoding;          // Return file encoding
    this.files = files;                    // List of files to be encrypted or decrypted
    this.version = CRYPTIFY_VERSION;    // Version info

    this.options = {};                  // Optional arguments

    try {
        this.__validateFiles(files);
    } catch (error) {
        this.__error(error.message);
    }

    // if (files) {
    //     this.__initFromModule(files, password, cipher, encoding);
    // }
}

Cryptify.prototype.__validateFiles = function (files) {
    if (!files ||
        (typeof files !== 'string' &&
        (Array.isArray(files) && !files.every(file => typeof file === 'string')))
    ) {
        throw new CryptifyException('"files" must be a string or an array of strings');
    }
};

Cryptify.prototype.__initFromModule = function (files, password, cipher, encoding) {
    this.files = files;
    this.command = DEFAULT_COMMAND;
    this.password = password;
    this.files = !Array.isArray(files) ? [files] : files;
    this.cipher = cipher || DEFAULT_CIPHER;
    this.encoding = encoding || DEFAULT_ENCODING;
};

Cryptify.__initFromCLI = function (args) {
    let configuration;
    try {
        if (!args || !args.length) {
            throw new CryptifyException('Expected array of arguments');
        }
        const optionsWithNoArgs = parseOptionsFromArguments(args, OPTIONS_WITH_NO_ARGS);
        configuration = {
            files      : parseFilesFromArguments(args),
            command    : parseOptionFromArguments(args, REQUIRED_OPTIONS, false),
            password   : parseOptionFromArguments(args, OPTION_MAP.PASSWORD, true),
            cipher     : parseOptionFromArguments(args, OPTION_MAP.CIPHER, true),
            encoding   : parseOptionFromArguments(args, OPTION_MAP.FILE_ENCODING, true),
            showVersion: deepFind(optionsWithNoArgs, OPTION_MAP.VERSION),
            showHelp   : deepFind(optionsWithNoArgs, OPTION_MAP.HELP)

        };
    } catch (error) {
        console.log('');    // Blank line for spacing
        console.log(`   \u2718 ${error.message}`);
        return;
    }

    return new Cryptify(
        configuration.files,
        configuration.password,
        configuration.cipher,
        configuration.encoding,
        configuration.showVersion,
        configuration.showHelp,
    );
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
    return deepFind(this.getOptions(), OPTION_MAP.HELP);
};

Cryptify.prototype.showVersion = function () {
    return deepFind(this.getOptions(), OPTION_MAP.VERSION);
};

Cryptify.prototype.doEncrypt = function () {
    return OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? crypto.createCipher : crypto.createDecipher;
};

Cryptify.prototype.isValidPassword = function () {
    return isValidPassword(
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
