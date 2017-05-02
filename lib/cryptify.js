'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _print = require('./print');

var _exception = require('./common/exception');

var _exception2 = _interopRequireDefault(_exception);

var _util = require('./common/util');

var _const = require('./common/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Cryptify(files, password, cipher, encoding) {
    this.command = undefined; // Encrypt or decrypt
    this.password = password; // Crypto key
    this.cipher = cipher; // Cipher algorithm
    this.encoding = encoding; // Return file encoding
    this.files = files; // List of files to be encrypted or decrypted
    this.version = _const.CRYPTIFY_VERSION; // Version info

    this.options = {}; // Optional arguments

    try {
        this.__validateFiles(files);
    } catch (error) {
        this.__error(error.message);
    }

    // if (files) {
    //     this.__initFromModule(files, password, cipher, encoding);
    // }
} /**
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

Cryptify.prototype.__validateFiles = function (files) {
    if (!files || typeof files !== 'string' && Array.isArray(files) && !files.every(function (file) {
        return typeof file === 'string';
    })) {
        throw new _exception2.default('"files" must be a string or an array of strings');
    }
};

Cryptify.prototype.__initFromModule = function (files, password, cipher, encoding) {
    this.files = files;
    this.command = _const.DEFAULT_COMMAND;
    this.password = password;
    this.files = !Array.isArray(files) ? [files] : files;
    this.cipher = cipher || _const.DEFAULT_CIPHER;
    this.encoding = encoding || _const.DEFAULT_ENCODING;
};

Cryptify.__initFromCLI = function (args) {
    var configuration = void 0;
    try {
        if (!args || !args.length) {
            throw new _exception2.default('Expected array of arguments');
        }
        var optionsWithNoArgs = (0, _util.parseOptionsFromArguments)(args, _const.OPTIONS_WITH_NO_ARGS);
        configuration = {
            files: (0, _util.parseFilesFromArguments)(args),
            command: (0, _util.parseOptionFromArguments)(args, _const.REQUIRED_OPTIONS, false),
            password: (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.PASSWORD, true),
            cipher: (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.CIPHER, true),
            encoding: (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.FILE_ENCODING, true),
            showVersion: (0, _util.deepFind)(optionsWithNoArgs, _const.OPTION_MAP.VERSION),
            showHelp: (0, _util.deepFind)(optionsWithNoArgs, _const.OPTION_MAP.HELP)

        };
    } catch (error) {
        console.log(''); // Blank line for spacing
        console.log('   \u2718 ' + error.message);
        return;
    }

    return new Cryptify(configuration.files, configuration.password, configuration.cipher, configuration.encoding, configuration.showVersion, configuration.showHelp);
};

Cryptify.prototype.encrypt = function () {
    this.command = _const.OPTION_MAP.ENCRYPT[0];
    return this.__cryptify();
};

Cryptify.prototype.decrypt = function () {
    this.command = _const.OPTION_MAP.DECRYPT[0];
    return this.__cryptify();
};

Cryptify.prototype.cryptifyFromCLI = function () {
    return this.__cryptify();
};

Cryptify.prototype.__cryptify = function () {
    var _this = this;

    return new Promise(function (resolve) {
        var closeEventCount = 0;

        _this.__info('Found ' + _this.getFiles().length + ' file(s)');

        _this.getFiles().forEach(function (file) {
            var inputPath = _path2.default.join(file);
            var outputPath = _path2.default.join(file + '.' + _const.EXTENSION);

            _this.__info('Working on "' + inputPath + '"');

            var cipher = _this.getCipherFunction()(_this.getCipher(), _this.getPassword());
            var is = _fs2.default.createReadStream(inputPath);
            var os = _fs2.default.createWriteStream(outputPath);

            is.pipe(cipher).pipe(os);

            os.on(_const.CLOSE_EVENT, function () {
                closeEventCount++;
                _fs2.default.renameSync(outputPath, inputPath);
                if (closeEventCount === _this.getFiles().length) {
                    _this.__info('Processing complete');
                    resolve(_this.getFiles().map(function (file) {
                        return _fs2.default.readFileSync(file, _this.getEncoding());
                    }));
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
    return (0, _util.deepFind)(this.getOptions(), _const.OPTION_MAP.HELP);
};

Cryptify.prototype.showVersion = function () {
    return (0, _util.deepFind)(this.getOptions(), _const.OPTION_MAP.VERSION);
};

Cryptify.prototype.doEncrypt = function () {
    return _const.OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? _crypto2.default.createCipher : _crypto2.default.createDecipher;
};

Cryptify.prototype.isValidPassword = function () {
    return (0, _util.isValidPassword)(this.getPassword());
};

Cryptify.prototype.printHelp = function () {
    (0, _print.printHelp)(this);
};

Cryptify.prototype.printVersion = function () {
    (0, _print.printVersion)(this);
};

Cryptify.prototype.__info = function (message) {
    if (message) this.__log('   \u2713 ' + message);
};

Cryptify.prototype.__log = function (message) {
    console.log(message);
};

Cryptify.prototype.__error = function (message, space) {
    if (message) {
        if (space) this.__log('');
        this.__log('   \u2718 ' + message);
    }
};

exports.default = Cryptify;