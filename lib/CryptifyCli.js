"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CryptifyBase = _interopRequireDefault(require("./CryptifyBase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CryptifyCli extends _CryptifyBase.default {
  constructor(mode, options) {
    var {
      args,
      password,
      cipher,
      encoding
    } = options;
    super(args, password, cipher, encoding);
    this.mode = mode;
    this.returnResults = false;
  }

}

var _default = CryptifyCli;
exports.default = _default;