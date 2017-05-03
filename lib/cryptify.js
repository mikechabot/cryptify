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
    this.password = password; // Crypto key
    this.cipher = cipher || _const.DEFAULT_CIPHER; // Cipher algorithm
    this.encoding = encoding || _const.DEFAULT_ENCODING; // Return file encoding
    this.files = !Array.isArray(files) ? [files] : files; // List of files to be encrypted or decrypted

    this.__validateFiles(this.getFiles());
    this.__validatePassword(this.getPassword());
    this.__validateCipher(this.getCipher());
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

Cryptify.__initFromCLI = function (args) {
    var instance = void 0;
    try {
        if (!args || !args.length) {
            (0, _print.printHelp)();
            return;
        }

        var optionsWithNoArgs = (0, _util.parseOptionsFromArguments)(args, _const.OPTIONS_WITH_NO_ARGS);
        var command = (0, _util.parseOptionFromArguments)(args, _const.REQUIRED_OPTIONS, false);
        var password = (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.PASSWORD, true);
        var cipher = (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.CIPHER, true);
        var encoding = (0, _util.parseOptionFromArguments)(args, _const.OPTION_MAP.FILE_ENCODING, true);

        if ((0, _util.someInclude)(optionsWithNoArgs, _const.OPTION_MAP.VERSION)) {
            (0, _print.printVersion)();
            return;
        }

        if ((0, _util.someInclude)(optionsWithNoArgs, _const.OPTION_MAP.HELP)) {
            (0, _print.printHelp)();
            return;
        }

        if (!command || !password) {
            throw new _exception2.default('Invalid usage, see --help');
        }

        var files = (0, _util.parseFilesFromArguments)(args);
        if (files.length < 1) {
            throw new _exception2.default('Must specify a file or files, see --help');
        }

        instance = new Cryptify(files, password, cipher, encoding);
        instance.setCommand(command);
    } catch (error) {
        console.log(''); // Blank line for spacing
        console.log('   \u2718 ' + error.message);
    }

    return instance;
};

Cryptify.prototype.__validateFiles = function (files) {
    if (!files || typeof files !== 'string' && Array.isArray(files) && !files.every(function (file) {
        return typeof file === 'string';
    })) {
        throw new _exception2.default('Must specify path(s) to file(s), see --help');
    }
    files.forEach(function (file) {
        if (!_fs2.default.existsSync(file)) {
            throw new _exception2.default('No such file: ' + file);
        }
    });
};

Cryptify.prototype.__validatePassword = function (password) {
    if (!password || typeof password !== 'string' || !(0, _util.isValidPassword)(password)) {
        throw new _exception2.default('Invalid password, see --help');
    }
};

Cryptify.prototype.__validateCipher = function (cipher) {
    if (!cipher || typeof cipher !== 'string' || !(0, _util.isValidCipher)(cipher)) {
        throw new _exception2.default('Invalid cipher: ' + cipher + ', see --help');
    }
};

Cryptify.prototype.encrypt = function () {
    this.setCommand(_const.OPTION_MAP.ENCRYPT[0]);
    return this.__cryptify();
};

Cryptify.prototype.decrypt = function () {
    this.setCommand(_const.OPTION_MAP.DECRYPT[0]);
    return this.__cryptify();
};

Cryptify.prototype.__cryptify = function () {
    var _this = this;

    function __handleError(reject, isCipher, error) {
        return !isCipher ? reject(new _exception2.default(error.message)) : error.message.indexOf('wrong final block length') !== -1 ? reject(new _exception2.default('Potential cipher mismatch: ' + error.message)) : reject(new _exception2.default(error.message));
    }

    return new Promise(function (resolve, reject) {
        var closeEventCount = 0;

        _this.__log(''); // Blank line for spacing
        _this.__info((_this.doEncrypt() ? 'Encrypting' : 'Decrypting') + ' ' + _this.getFiles().length + ' file(s) with ' + (0, _util.getSafePassword)(_this.getPassword()));
        _this.__info('Using ' + _this.getCipher() + ' cipher ');
        _this.__info('Using ' + _this.getEncoding() + ' encoding');

        _this.getFiles().forEach(function (file) {
            var inputPath = _path2.default.join(file);
            var outputPath = _path2.default.join(file + '.' + _const.EXTENSION);

            _this.__info('Working on "' + inputPath + '"');

            var cipher = _this.getCipherFunction()(_this.getCipher(), _this.getPassword());
            var is = _fs2.default.createReadStream(inputPath);
            var os = _fs2.default.createWriteStream(outputPath);

            is.on('error', __handleError.bind(null, reject)).pipe(cipher).on('error', __handleError.bind(null, reject, true)).pipe(os).on('error', __handleError.bind(null, reject)).on('close', function () {
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
    return _const.OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? _crypto2.default.createCipher : _crypto2.default.createDecipher;
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