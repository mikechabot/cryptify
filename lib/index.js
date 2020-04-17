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

var _const = require("./const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Cryptify {
  constructor(mode, files, password, algorithm, encoding, obfuscate) {
    if (mode !== _const.COMMAND_MODE.DECRYPT && mode !== _const.COMMAND_MODE.ENCRYPT) {
      throw new Error('Cryptify was instantiated with an unknown mode');
    }

    this.mode = mode;
    this.files = files;
    this.password = password;
    this.algorithm = algorithm || _const.DEFAULT.CIPHER_ALGORITHM;
    this.encoding = encoding || _const.DEFAULT.ENCODING;
    this.obfuscate = obfuscate === true;
    this.key = _crypto.default.createHash(_const.DEFAULT.HASH_ALGORITHM).update(this.password).digest();
    this.iv = null;
    this.cipher = null;

    this._validateFiles(this.files);

    this._validatePassword(this.password);

    this._validateCipherAlgorithm(this.algorithm);
  }

  isEncrypting() {
    return this.mode === _const.COMMAND_MODE.ENCRYPT;
  }

  getModeVerb() {
    return this.isEncrypting() ? 'Encrypting' : 'Decrypting';
  }
  /**
   * Ensure the file exist on the filesystem
   * @param files
   * @private
   */


  _validateFiles(files) {
    if (!Array.isArray(files) || files.length === 0 || !files.every(file => typeof file === 'string')) {
      throw new Error("Must specify path(s) to file(s), Run \"cryptify help ".concat(this.mode, "\""));
    }

    files.forEach(file => {
      if (!_fs.default.existsSync(file)) {
        throw new Error("No such file: ".concat(file));
      }
    });
  }
  /**
   * Ensure the password meets complexity requirements
   * @param password
   * @private
   */


  _validatePassword(password) {
    if (!password || typeof password !== 'string' || !(0, _funcs.isValidPassword)(password)) {
      throw new Error("Invalid password, Run \"cryptify help ".concat(this.mode, "\""));
    }
  }
  /**
   * Ensure the cipher is supported by OpenSSL
   * @param cipher
   * @private
   */


  _validateCipherAlgorithm(algorithm) {
    if (!algorithm || typeof algorithm !== 'string' || !(0, _funcs.isValidCipherAlgorithm)(algorithm)) {
      throw new Error("Invalid cipher: \"".concat(algorithm, "\", Run \"cryptify --list\""));
    }
  }

  getFilePaths(file) {
    var iPath = _path.default.join(file);

    var oPath = _path.default.join("".concat(file, ".").concat(_const.DEFAULT.EXTENSION));

    return {
      iPath,
      oPath
    };
  }

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
      _this.cipher = _this._generateCipher(_this.iv);
      oStream.write(_this.iv);
      return {
        iStream,
        oStream,
        iPath,
        oPath
      };
    })();
  }

  getDecryptionSteams(file) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var {
        iPath,
        oPath
      } = _this2.getFilePaths(file);

      _this2.iv = yield _this2.getIvFromStream(iPath);
      _this2.cipher = _this2._generateCipher(_this2.iv);
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

  execute() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      var filesRead = 0;

      _this3.logDetails();

      for (var file of _this3.files) {
        _logger.default.info("Working on \"".concat(file, "\""));

        var streamsGetter = _this3.isEncrypting() ? _this3.getEncryptionStreams.bind(_this3) : _this3.getDecryptionSteams.bind(_this3);
        var {
          iStream,
          oStream,
          iPath,
          oPath
        } = yield streamsGetter(file);
        var result = yield _this3.processStream(iStream, oStream);

        if (result) {
          _fs.default.renameSync(oPath, iPath);

          if (++filesRead === _this3.files.length) {
            _logger.default.info('Processing complete');
          }
        }
      }
    })();
  }

  processStream(iStream, oStream) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return new Promise((resolve, reject) => {
        iStream.pipe(_this4.cipher).on(_const.STREAM_EVENT.ERROR, e => reject(e)).pipe(oStream).on(_const.STREAM_EVENT.CLOSE, () => resolve(true));
      });
    })();
  }

  _generateCipher(iv) {
    return this.isEncrypting() ? _crypto.default.createCipheriv(this.algorithm, this.key, iv) : _crypto.default.createDecipheriv(this.algorithm, this.key, iv);
  }

  logDetails() {
    _logger.default.blank();

    _logger.default.info("".concat(this.getModeVerb(), " ").concat(this.files.length, " file(s) with ").concat((0, _funcs.getSafePassword)(this.password)));

    _logger.default.info("Cipher: ".concat(this.algorithm));

    _logger.default.info("Encoding: ".concat(this.encoding));
  }

}

var _default = Cryptify;
exports.default = _default;