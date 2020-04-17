"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _logger = _interopRequireDefault(require("./util/logger"));

var _funcs = require("./util/funcs");

var _information = require("./util/logger/information");

var _const = require("./const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class CryptifyBase {
  constructor(files, password, algorithm, encoding) {
    if (!_crypto.default) {
      throw new Error('Node.js crypto lib not found');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a string');
    }

    this.files = files;
    this.password = password;
    this.algorithm = algorithm || _const.DEFAULT.CIPHER_ALGORITHM;
    this.encoding = encoding || _const.DEFAULT.ENCODING;
    this.key = _crypto.default.createHash(_const.DEFAULT.HASH_ALGORITHM).update(this.password).digest();
    this.isModule = false;
    this.iv = null;
    this.mode = null;
    this.cipher = null;
    this.returnResults = null;
  }
  /**
   * Determine if we're encrypting or decrypting
   * @returns {boolean}
   */


  isEncrypting() {
    if (!this.mode) {
      throw new Error("Command method not set. Expecting \"".concat(_const.COMMAND_MODE.ENCRYPT, "\" or ").concat(_const.COMMAND_MODE.DECRYPT));
    }

    return this.mode === _const.COMMAND_MODE.ENCRYPT;
  }
  /**
   * Get the verb for the command mode
   * @returns {string}
   */


  getModeVerb() {
    return this.isEncrypting() ? 'Encrypting' : 'Decrypting';
  }
  /**
   * Ensure the file exist on the filesystem
   * @param files
   * @private
   */


  validateFiles(files) {
    if (!Array.isArray(files) || files.length === 0 || !files.every(file => typeof file === 'string')) {
      throw new Error("Must specify path(s) to file(s). ".concat((0, _information.printRunHelp)(this.isModule, this.mode)));
    }

    files.forEach(file => {
      var filePath = _path.default.resolve(file);

      if (!_fs.default.existsSync(filePath)) {
        throw new Error("No such file: ".concat(file));
      }
    });
  }
  /**
   * Ensure the password meets complexity requirements
   * @param password
   * @private
   */


  validatePassword(password) {
    if (!password || typeof password !== 'string' || !(0, _funcs.isValidPassword)(password)) {
      _logger.default.blank();

      (0, _information.printPasswordRequirements)();

      _logger.default.blank();

      throw new Error("Invalid password. ".concat((0, _information.printRunHelp)(this.isModule, this.mode)));
    }
  }
  /**
   * Ensure the cipher is supported by OpenSSL
   * @param cipher
   * @private
   */


  validateCipherAlgorithm(algorithm) {
    if (!algorithm || typeof algorithm !== 'string' || !(0, _funcs.isValidCipherAlgorithm)(algorithm)) {
      throw new Error("Invalid cipher: \"".concat(algorithm, "\", Run \"cryptify --list\""));
    }
  }
  /**
   * Generate a cipher given a cipher algorithm, key and IV
   * @param iv
   * @returns {any}
   */


  generateCipher(iv) {
    return this.isEncrypting() ? _crypto.default.createCipheriv(this.algorithm, this.key, iv) : _crypto.default.createDecipheriv(this.algorithm, this.key, iv);
  }
  /**
   * Get input/output file paths
   * @param file
   * @returns {{iPath: string, oPath: string}}
   */


  getFilePaths(file) {
    var iPath = _path.default.join(file);

    var oPath = _path.default.join("".concat(file, ".").concat(_const.DEFAULT.EXTENSION));

    return {
      iPath,
      oPath
    };
  }
  /**
   * Get the encryption streams, and generate a random IV and
   * persist it to the output stream. We'll use the persisted IV
   * during the decryption process.
   * @param file
   * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
   */


  getEncryptionStreams(file) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var {
        iPath,
        oPath
      } = _this.getFilePaths(file);

      var iStream = _fs.default.createReadStream(iPath);

      var oStream = _fs.default.createWriteStream(oPath);

      _this.iv = _crypto.default.randomBytes(_const.IV_BLOCK_LENGTH);
      _this.cipher = _this.generateCipher(_this.iv);
      oStream.write(_this.iv);
      return {
        iStream,
        oStream,
        iPath,
        oPath
      };
    })();
  }
  /**
   * Get the decryption streams, and obtain the IV from
   * the encrypted data. Use this persisted IV to generate
   * the cipher for decryption.
   * @param file
   * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
   */


  getDecryptionSteams(file) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var {
        iPath,
        oPath
      } = _this2.getFilePaths(file);

      _this2.iv = yield _this2.getIvFromStream(iPath);
      _this2.cipher = _this2.generateCipher(_this2.iv);
      return {
        iPath,
        oPath,
        oStream: _fs.default.createWriteStream(oPath),
        iStream: _fs.default.createReadStream(iPath, {
          start: _const.IV_BLOCK_LENGTH
        })
      };
    })();
  }
  /**
   * Get the IV that is stored within the encrypted file
   * @param inputPath
   * @returns {Promise<unknown>}
   */


  getIvFromStream(inputPath) {
    return _asyncToGenerator(function* () {
      return new Promise(resolve => {
        var iv = null;

        _fs.default.createReadStream(inputPath, {
          start: 0,
          end: _const.IV_BLOCK_LENGTH - 1
        }).on(_const.STREAM_EVENT.DATA, persistedIv => iv = persistedIv).on(_const.STREAM_EVENT.CLOSE, () => resolve(iv));
      });
    })();
  }
  /**
   * Pipe the input stream into the output stream. During this
   * process we'll either be encrypting or decrypting.
   * @param iStream
   * @param oStream
   * @returns {Promise<unknown>}
   */


  processStream(iStream, oStream) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return new Promise((resolve, reject) => {
        iStream.pipe(_this3.cipher).on(_const.STREAM_EVENT.ERROR, e => reject(e)).pipe(oStream).on(_const.STREAM_EVENT.CLOSE, () => resolve(null));
      });
    })();
  }

  getFilesSync() {
    return this.files.map(file => _fs.default.readFileSync(file, this.encoding));
  }
  /**
   * Run the encryption/decryption process
   * @returns {Promise<void>}
   */


  execute() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      try {
        _this4.validateFiles(_this4.files);

        _this4.validatePassword(_this4.password);

        _this4.validateCipherAlgorithm(_this4.algorithm);
      } catch (e) {
        return Promise.reject(e);
      }

      var filesRead = 0;

      _logger.default.blank();

      _logger.default.info("".concat(_this4.getModeVerb(), " ").concat(_this4.files.length, " file(s) with ").concat((0, _funcs.getSafePassword)(_this4.password)));

      _logger.default.info("Cipher: ".concat(_this4.algorithm));

      _logger.default.info("Encoding: ".concat(_this4.encoding));

      for (var file of _this4.files) {
        _logger.default.info("Working on \"".concat(file, "\""));

        var streamsGetter = _this4.isEncrypting() ? _this4.getEncryptionStreams.bind(_this4) : _this4.getDecryptionSteams.bind(_this4);
        var {
          iStream,
          oStream,
          iPath,
          oPath
        } = yield streamsGetter(file);
        var error = yield _this4.processStream(iStream, oStream);

        if (error) {
          return Promise.reject(error);
        }

        _fs.default.renameSync(oPath, iPath);

        if (++filesRead === _this4.files.length) {
          _logger.default.info('Processing complete');

          var results = _this4.returnResults ? _this4.getFilesSync() : undefined;
          return Promise.resolve(results);
        }
      }
    })();
  }

}

var _default = CryptifyBase;
exports.default = _default;