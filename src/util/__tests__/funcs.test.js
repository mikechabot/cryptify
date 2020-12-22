import { isValidCipherAlgorithm, isValidPassword, getSafePassword } from '../funcs';

import * as helpers from '../helpers';
import { SPECIAL_CHARACTERS } from '../../const';

describe('Util Funcs', () => {
  describe('isValidPassword', () => {
    let hasLowerCaseSpy;
    let hasNumberSpy;
    let hasUpperCase;

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
      expect(typeof isValidPassword).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect(isValidPassword(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect(isValidPassword(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect(isValidPassword(1111111)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect(isValidPassword([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect(isValidPassword({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect(isValidPassword(() => {})).toBe(false);
    });
    test('should return false if a string less than 8 characters is passed', () => {
      expect(isValidPassword('Abc123!')).toBe(false);
    });
    describe('Special Characters', () => {
      test('should return false if no special characters are passed', () => {
        expect(isValidPassword('Abc12345')).toBe(false);
      });
      test('should return true if special characters are passed', () => {
        SPECIAL_CHARACTERS.forEach((character) => {
          expect(isValidPassword(`Abc12345${character}`)).toBe(true);
        });
      });
    });
  });
  describe('getSafePassword', () => {
    test('should be a function', () => {
      expect(typeof getSafePassword).toEqual('function');
    });
    test('should return null if undefined is passed', () => {
      expect(getSafePassword(undefined)).toBeNull();
    });
    test('should return null if null is passed', () => {
      expect(getSafePassword(null)).toBeNull();
    });
    test('should return null if a number is passed', () => {
      expect(getSafePassword(1)).toBeNull();
    });
    test('should return null if an array is passed', () => {
      expect(getSafePassword([])).toBeNull();
    });
    test('should return null if an object is passed', () => {
      expect(getSafePassword({})).toBeNull();
    });
    test('should return null if a function is passed', () => {
      expect(getSafePassword(() => {})).toBeNull();
    });
    test('should return null if a string less than 3 characters is passed', () => {
      expect(getSafePassword('aa')).toBeNull();
    });
    test('should return a string if a string 3 characters or more is passed', () => {
      expect(typeof getSafePassword('aaa')).toEqual('string');
    });
    test('should return a string with asterisks in the middle', () => {
      expect(getSafePassword('foo')).toEqual('f*o');
      expect(getSafePassword('foobar')).toEqual('f****r');
      expect(getSafePassword('foobarbaz')).toEqual('f*******z');
    });
  });
  describe('isValidCipherAlgorithm', () => {
    test('should be a function', () => {
      expect(typeof isValidCipherAlgorithm).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect(isValidCipherAlgorithm(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect(isValidCipherAlgorithm(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect(isValidCipherAlgorithm(1)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect(isValidCipherAlgorithm([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect(isValidCipherAlgorithm({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect(isValidCipherAlgorithm(() => {})).toBe(false);
    });
    test('should return false if an invalid cipher is passed', () => {
      expect(isValidCipherAlgorithm('foobar')).toBe(false);
    });
    test('should return true if a valid cipher is passed', () => {
      expect(isValidCipherAlgorithm('aria-256-cfb8')).toBe(true);
    });
  });
});
