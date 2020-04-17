"use strict";

var _crypto = _interopRequireDefault(require("crypto"));

var _funcs = require("../funcs");

var helpers = _interopRequireWildcard(require("../helpers"));

var _const = require("../../const");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Util Funcs', () => {
  describe('isValidPassword', () => {
    var hasLowerCaseSpy;
    var hasNumberSpy;
    var hasUpperCase;
    beforeEach(() => {
      hasLowerCaseSpy = jest.spyOn(helpers, 'hasLowerCase');
      hasNumberSpy = jest.spyOn(helpers, 'hasNumber');
      hasUpperCase = jest.spyOn(helpers, 'hasUpperCase');
      hasLowerCaseSpy.mockReturnValue(true);
      hasNumberSpy.mockReturnValue(true);
      hasUpperCase.mockReturnValue(true);
    });
    afterEach(() => {
      hasLowerCaseSpy.mockRestore();
      hasNumberSpy.mockRestore();
      hasUpperCase.mockRestore();
    });
    test('should be a function', () => {
      expect(typeof _funcs.isValidPassword).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect((0, _funcs.isValidPassword)(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect((0, _funcs.isValidPassword)(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect((0, _funcs.isValidPassword)(1111111)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect((0, _funcs.isValidPassword)([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect((0, _funcs.isValidPassword)({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect((0, _funcs.isValidPassword)(() => {})).toBe(false);
    });
    test('should return false if a string less than 8 characters is passed', () => {
      expect((0, _funcs.isValidPassword)('Abc123!')).toBe(false);
    });
    describe('Special Characters', () => {
      test('should return false if no special characters are passed', () => {
        expect((0, _funcs.isValidPassword)('Abc12345')).toBe(false);
      });
      test('should return true if special characters are passed', () => {
        _const.SPECIAL_CHARACTERS.forEach(character => {
          expect((0, _funcs.isValidPassword)("Abc12345".concat(character))).toBe(true);
        });
      });
    });
  });
  describe('getSafePassword', () => {
    test('should be a function', () => {
      expect(typeof _funcs.getSafePassword).toEqual('function');
    });
    test('should return null if undefined is passed', () => {
      expect((0, _funcs.getSafePassword)(undefined)).toBeNull();
    });
    test('should return null if null is passed', () => {
      expect((0, _funcs.getSafePassword)(null)).toBeNull();
    });
    test('should return null if a number is passed', () => {
      expect((0, _funcs.getSafePassword)(1)).toBeNull();
    });
    test('should return null if an array is passed', () => {
      expect((0, _funcs.getSafePassword)([])).toBeNull();
    });
    test('should return null if an object is passed', () => {
      expect((0, _funcs.getSafePassword)({})).toBeNull();
    });
    test('should return null if a function is passed', () => {
      expect((0, _funcs.getSafePassword)(() => {})).toBeNull();
    });
    test('should return null if a string less than 3 characters is passed', () => {
      expect((0, _funcs.getSafePassword)('aa')).toBeNull();
    });
    test('should return a string if a string 3 characters or more is passed', () => {
      expect(typeof (0, _funcs.getSafePassword)('aaa')).toEqual('string');
    });
    test('should return a string with asterisks in the middle', () => {
      expect((0, _funcs.getSafePassword)('foo')).toEqual('f*o');
      expect((0, _funcs.getSafePassword)('foobar')).toEqual('f****r');
      expect((0, _funcs.getSafePassword)('foobarbaz')).toEqual('f*******z');
    });
  });
  describe('isValidCipherAlgorithm', () => {
    var getCiphersSpy;
    beforeEach(() => {
      getCiphersSpy = jest.spyOn(_crypto.default, 'getCiphers');
      getCiphersSpy.mockReturnValue(['foo', 'bar', 'baz', 'qux']);
    });
    afterEach(() => {
      getCiphersSpy.mockRestore();
    });
    test('should be a function', () => {
      expect(typeof _funcs.isValidCipherAlgorithm).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)(1)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)(() => {})).toBe(false);
    });
    test('should return false if an invalid cipher is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)('foobar')).toBe(false);
    });
    test('should return true if a valid cipher is passed', () => {
      expect((0, _funcs.isValidCipherAlgorithm)('qux')).toBe(true);
    });
  });
});