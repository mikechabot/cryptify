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

var _util = require('./common/util');

var _const = require('./common/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function Cryptify(files, password, cipher, encoding) {
    this.command = undefined; // Encrypt or decrypt
    this.password = undefined; // Crypto key
    this.cipher = undefined; // Cipher algorithm
    this.encoding = undefined; // Return file encoding
    this.files = []; // List of files to be encrypted or decrypted
    this.version = _const.CRYPTIFY_VERSION; // Version info

    this.options = {}; // Optional arguments

    if (files) {
        this.__initFromModule(files, password, cipher, encoding);
    }
}

Cryptify.prototype.__initFromModule = function (files, password, cipher, encoding) {
    this.files = files;
    this.command = _const.DEFAULT_COMMAND;
    this.password = password;
    this.files = !Array.isArray(files) ? [files] : files;
    this.cipher = cipher || _const.DEFAULT_CIPHER;
    this.encoding = encoding || _const.DEFAULT_ENCODING;
};

Cryptify.prototype.__initFromCLI = function (args) {
    var _this = this;

    this.options = this.parseOptionsFromArguments(args, _const.OPTIONS_WITH_NO_ARGS);

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

    this.command = this.parseValidateAndSet(args, _const.REQUIRED_OPTIONS, false, _const.COMMAND);
    this.password = this.parseValidateAndSet(args, _const.OPTION_MAP.PASSWORD, true, _const.PASSWORD);
    this.cipher = this.parseValidateAndSet(args, _const.OPTION_MAP.CIPHER, true, _const.CIPHER, true) || _const.DEFAULT_CIPHER;
    this.encoding = this.parseValidateAndSet(args, _const.OPTION_MAP.FILE_ENCODING, true, _const.ENCODING, true) || _const.DEFAULT_ENCODING;

    args.forEach(function (value, index) {
        if (!_const.OPTION_ARRAY.includes(value) && !_const.OPTIONS_WITH_ARGS.includes(args[index - 1])) {
            if (!_fs2.default.existsSync(value)) {
                _this.__error('No such file: ' + value, true);
                process.exit(1);
            } else if (!_this.files.includes(value)) {
                _this.__info('Found file "' + value + '"');
                _this.files.push(value);
            }
        }
    });

    this.__info('Using key "' + (0, _util._getSafePassword)(this.getPassword()) + '"');
    this.__info((this.doEncrypt() ? 'Encrypting' : 'Decrypting') + ' with ' + this.getCipher());

    return this;
};

Cryptify.prototype.parseOptionsFromArguments = function (lookIn, lookFor, getArgument) {
    return lookIn.map(function (value, index) {
        return lookFor.includes(value) ? getArgument ? lookIn[index + 1] : value : null;
    }).filter(function (value) {
        return value;
    });
};

Cryptify.prototype.parseValidateAndSet = function (lookIn, lookFor, getArgument, optionKey, allowNone) {
    var matches = this.parseOptionsFromArguments(lookIn, lookFor, getArgument);
    this.validateOptionSyntax(matches, optionKey, allowNone);
    return matches[0];
};

Cryptify.prototype.validateOptionSyntax = function (list, key, allowNone) {
    if (!allowNone && list.length === 0) {
        this.__error('Missing required ' + key + ', see help (--help)');
        process.exit(1);
    }
    if (list.length > 1) {
        this.__error('Only single ' + key + ' allowed, see help (--help)');
        process.exit(1);
    }
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
    var _this2 = this;

    return new Promise(function (resolve) {
        var closeEventCount = 0;

        _this2.__info('Found ' + _this2.getFiles().length + ' file(s)');

        _this2.getFiles().forEach(function (file) {
            var inputPath = _path2.default.join(file);
            var outputPath = _path2.default.join(file + '.' + _const.EXTENSION);

            _this2.__info('Working on "' + inputPath + '"');

            var cipher = _this2.getCipherFunction()(_this2.getCipher(), _this2.getPassword());
            var is = _fs2.default.createReadStream(inputPath);
            var os = _fs2.default.createWriteStream(outputPath);

            is.pipe(cipher).pipe(os);

            os.on(_const.CLOSE_EVENT, function () {
                closeEventCount++;
                _fs2.default.renameSync(outputPath, inputPath);
                if (closeEventCount === _this2.getFiles().length) {
                    _this2.__info('Processing complete');
                    resolve(_this2.getFiles().map(function (file) {
                        return _fs2.default.readFileSync(file, _this2.getEncoding());
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
    return (0, _util._contains)(this.getOptions(), _const.OPTION_MAP.HELP);
};

Cryptify.prototype.showVersion = function () {
    return (0, _util._contains)(this.getOptions(), _const.OPTION_MAP.VERSION);
};

Cryptify.prototype.doEncrypt = function () {
    return _const.OPTION_MAP.ENCRYPT.includes(this.getCommand());
};

Cryptify.prototype.getCipherFunction = function () {
    return this.doEncrypt() ? _crypto2.default.createCipher : _crypto2.default.createDecipher;
};

Cryptify.prototype.isValidCipher = function () {
    return _crypto2.default.getCiphers().includes(this.getCipher());
};

Cryptify.prototype.isValidPassword = function () {
    return (0, _util._isValidPassword)(this.getPassword());
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