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
 * Cryptify
 *
 * @param options
 * @constructor
 */

function Cryptify(options) {
    this.command = undefined; // Encrypt or decrypt
    this.password = undefined; // Crypto key
    this.cipher = undefined; // Cipher algorithm
    this.encoding = undefined; // Return file encoding
    this.debug = false; // Debug log
    this.files = []; // List of files to be encrypted or decrypted
    this.options = {}; // Optional arguments
    this.version = _const.CRYPTIFY_VERSION; // Version info

    if (options) {
        this.__init(options);
    }
}

Cryptify.prototype.__init = function (args) {
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

    // Set debug mode
    this.debug = (0, _util._contains)(this.options, _const.OPTION_MAP.DEBUG);

    //  Blank line for spacing
    this.__log('');

    var commands = this.parseOptionsFromArguments(args, _const.REQUIRED_OPTIONS);
    this.validateOptionSyntax(commands, _const.COMMAND);
    this.command = commands[0];
    this.__debug('Encrypt? ' + this.doEncrypt());

    var passwords = this.parseOptionsFromArguments(args, _const.OPTION_MAP.PASSWORD, true);
    this.validateOptionSyntax(passwords, _const.PASSWORD);
    this.password = passwords[0];
    this.__debug('Set password to "' + (0, _util._getSafePassword)(this.getPassword()) + '"');
    if (!this.isValidPassword(this.getPassword())) {
        this.__error('Invalid password, see help (--help)');
        process.exit(1);
    }

    var ciphers = this.parseOptionsFromArguments(args, _const.OPTION_MAP.CIPHER, true);
    this.validateOptionSyntax(ciphers, _const.CIPHER, true);
    this.cipher = ciphers[0] || _const.DEFAULT_CIPHER;
    this.__debug('Set cipher to "' + this.getCipher() + '"');
    if (!this.isValidCipher(this.getCipher())) {
        this.__error('Invalid cipher, see help (--help)');
        process.exit(1);
    }

    if (this.doReturnFiles()) {
        var encoding = this.parseOptionsFromArguments(args, _const.OPTION_MAP.FILE_ENCODING, true);
        this.encoding = encoding[0] || _const.DEFAULT_ENCODING;
        this.validateOptionSyntax(encoding, _const.ENCODING, true);
        this.__debug('Return files? ' + this.doReturnFiles());
        this.__debug('Set encoding to "' + this.getEncoding() + '"');
    }

    args.forEach(function (value, index) {
        if (!_const.OPTION_ARRAY.includes(value) && !_const.OPTIONS_WITH_ARGS.includes(args[index - 1])) {
            if (!_fs2.default.existsSync(value)) {
                _this.__error('No such file: ' + value);
                process.exit(1);
            } else if (!_this.files.includes(value)) {
                _this.__info('Found file "' + value + '"');
                _this.files.push(value);
            }
        }
    });
};

Cryptify.prototype.parseOptionsFromArguments = function (lookIn, lookFor, getArgument) {
    return lookIn.map(function (value, index) {
        return lookFor.includes(value) ? getArgument ? lookIn[index + 1] : value : null;
    }).filter(function (value) {
        return value;
    });
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

Cryptify.prototype.cryptify = function () {
    var _this2 = this;

    return new Promise(function (resolve) {
        var closeEventCount = 0;

        _this2.__debug('Processing ' + _this2.getFiles().length + ' file(s)');

        _this2.getFiles().forEach(function (file) {
            var inputPath = _path2.default.join(file);
            var outputPath = _path2.default.join(file + '.' + _const.EXTENSION);

            _this2.__debug('Processing "' + inputPath + '"');

            var cipher = _this2.getCipherFunction()(_this2.getCipher(), _this2.getPassword());
            var is = _fs2.default.createReadStream(inputPath);
            var os = _fs2.default.createWriteStream(outputPath);

            _this2.__debug('Piping contents to "' + outputPath + '"');
            is.pipe(cipher).pipe(os);

            os.on(_const.CLOSE_EVENT, function () {
                _this2.__debug('Renaming "' + outputPath + '" to "' + inputPath + '"');
                _fs2.default.renameSync(outputPath, inputPath);

                _this2.__debug('Incrementing close event count to ' + ++closeEventCount);
                if (closeEventCount === _this2.getFiles().length) {
                    _this2.__info('Processing complete');
                    resolve(_this2.doEncrypt() || !_this2.doReturnFiles() ? undefined : _this2.getFiles().map(function (file) {
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

Cryptify.prototype.doReturnFiles = function () {
    return (0, _util._contains)(this.getOptions(), _const.OPTION_MAP.RETURN_FILE);
};

Cryptify.prototype.isDebug = function () {
    return this.debug;
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

Cryptify.prototype.__debug = function (message) {
    if (this.isDebug()) this.__info(message);
};

Cryptify.prototype.__info = function (message) {
    if (message) this.__log('    \u2713 ' + message);
};

Cryptify.prototype.__log = function (message) {
    console.log(message);
};

Cryptify.prototype.__error = function (message) {
    if (message) this.__log('   \u2718 ' + message);
};

exports.default = Cryptify;