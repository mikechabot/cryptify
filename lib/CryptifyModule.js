"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CryptifyBase = _interopRequireDefault(require("./CryptifyBase"));

var _const = require("./const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CryptifyModule extends _CryptifyBase.default {
  constructor(files, password, cipher, encoding) {
    super(typeof files === 'string' ? [files] : files, password, cipher, encoding);
    this.isModule = true;
    this.returnResults = true;
  }

  encrypt() {
    this.mode = _const.COMMAND_MODE.ENCRYPT;
    return this.execute();
  }

  decrypt() {
    this.mode = _const.COMMAND_MODE.DECRYPT;
    return this.execute();
  }

}

var _default = CryptifyModule;
exports.default = _default;