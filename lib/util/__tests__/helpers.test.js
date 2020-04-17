"use strict";

var _helpers = require("../helpers");

describe('Helper Funcs', () => {
  describe('hasLowerCase', () => {
    test('should be a function', () => {
      expect(typeof _helpers.hasLowerCase).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect((0, _helpers.hasLowerCase)(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect((0, _helpers.hasLowerCase)(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect((0, _helpers.hasLowerCase)(1)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect((0, _helpers.hasLowerCase)([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect((0, _helpers.hasLowerCase)({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect((0, _helpers.hasLowerCase)(() => {})).toBe(false);
    });
    test('should return false if a string number is passed', () => {
      expect((0, _helpers.hasLowerCase)('1')).toBe(false);
    });
    test('should return false if no lowercase is passed', () => {
      expect((0, _helpers.hasLowerCase)('A')).toBe(false);
    });
    test('should return true if lowercase is passed', () => {
      expect((0, _helpers.hasLowerCase)('a')).toBe(true);
    });
  });
  describe('hasUpperCase', () => {
    test('should be a function', () => {
      expect(typeof _helpers.hasUpperCase).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect((0, _helpers.hasUpperCase)(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect((0, _helpers.hasUpperCase)(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect((0, _helpers.hasUpperCase)(1)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect((0, _helpers.hasUpperCase)([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect((0, _helpers.hasUpperCase)({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect((0, _helpers.hasUpperCase)(() => {})).toBe(false);
    });
    test('should return false if a string number is passed', () => {
      expect((0, _helpers.hasUpperCase)('1')).toBe(false);
    });
    test('should return false if no uppercase is passed', () => {
      expect((0, _helpers.hasUpperCase)('a')).toBe(false);
    });
    test('should return true if uppercase is passed', () => {
      expect((0, _helpers.hasUpperCase)('A')).toBe(true);
    });
  });
  describe('hasNumber', () => {
    test('should be a function', () => {
      expect(typeof _helpers.hasNumber).toEqual('function');
    });
    test('should return false if undefined is passed', () => {
      expect((0, _helpers.hasNumber)(undefined)).toBe(false);
    });
    test('should return false if null is passed', () => {
      expect((0, _helpers.hasNumber)(null)).toBe(false);
    });
    test('should return false if a number is passed', () => {
      expect((0, _helpers.hasNumber)(1)).toBe(false);
    });
    test('should return false if an array is passed', () => {
      expect((0, _helpers.hasNumber)([])).toBe(false);
    });
    test('should return false if an object is passed', () => {
      expect((0, _helpers.hasNumber)({})).toBe(false);
    });
    test('should return false if a function is passed', () => {
      expect((0, _helpers.hasNumber)(() => {})).toBe(false);
    });
    test('should return false if a string with no number is passed', () => {
      expect((0, _helpers.hasNumber)('a')).toBe(false);
    });
    test('should return true if a string with a number is passed', () => {
      expect((0, _helpers.hasNumber)('1')).toBe(true);
    });
  });
  describe('someInclude', () => {
    test('should be a function', () => {
      expect(typeof _helpers.someInclude).toEqual('function');
    });
    describe('lookIn is invalid and lookFor is valid', () => {
      test('should return false if lookIn is undefined and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)(undefined, ['foo'])).toBe(false);
      });
      test('should return false if lookIn is null and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)(null, ['foo'])).toBe(false);
      });
      test('should return false if lookIn is a number and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)(1, ['foo'])).toBe(false);
      });
      test('should return false if lookIn is an empty array and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)([], ['foo'])).toBe(false);
      });
      test('should return false if lookIn is an object and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)({}, ['foo'])).toBe(false);
      });
      test('should return false if lookIn is a function and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)(() => {}, ['foo'])).toBe(false);
      });
      test('should return false if lookIn is a string and lookFor is a populated array', () => {
        expect((0, _helpers.someInclude)('a', ['foo'])).toBe(false);
      });
    });
    describe('lookIn is valid and lookFor is invalid', () => {
      test('should return false if lookFor is undefined and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], undefined)).toBe(false);
      });
      test('should return false if lookFor is null and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], null)).toBe(false);
      });
      test('should return false if lookFor is a number and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], 1)).toBe(false);
      });
      test('should return false if lookFor is an empty array and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], [])).toBe(false);
      });
      test('should return false if lookFor is an object and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], {})).toBe(false);
      });
      test('should return false if lookFor is a function and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], () => {})).toBe(false);
      });
      test('should return false if lookFor is a string and lookIn is a populated array', () => {
        expect((0, _helpers.someInclude)(['foo'], 'a')).toBe(false);
      });
    });
    describe('lookIn is invalid and lookFor is invalid', () => {
      test('should return false if lookIn and lookFor are undefined', () => {
        expect((0, _helpers.someInclude)(undefined, undefined)).toBe(false);
      });
      test('should return false if lookIn and lookFor are null', () => {
        expect((0, _helpers.someInclude)(null, null)).toBe(false);
      });
      test('should return false if lookIn and lookFor are numbers', () => {
        expect((0, _helpers.someInclude)(1, 1)).toBe(false);
      });
      test('should return false if lookIn and lookFor are empty arrays', () => {
        expect((0, _helpers.someInclude)([], [])).toBe(false);
      });
      test('should return false if lookIn and lookFor are object', () => {
        expect((0, _helpers.someInclude)({}, {})).toBe(false);
      });
      test('should return false if lookIn and lookFor are functions', () => {
        expect((0, _helpers.someInclude)(() => {}, () => {})).toBe(false);
      });
      test('should return false if lookIn and lookFor are strings', () => {
        expect((0, _helpers.someInclude)('a', 'a')).toBe(false);
      });
    });
    describe('lookIn is valid and lookFor is valid', () => {
      test('should return true if lookIn contains a number from lookFor', () => {
        expect((0, _helpers.someInclude)([2], [1, 2])).toBe(true);
      });
      test('should return true if lookIn contains a string from lookFor', () => {
        expect((0, _helpers.someInclude)(['2'], ['1', '2'])).toBe(true);
      });
      test('should return true if lookIn contains an object from lookFor', () => {
        var obj1 = {
          foo: 'bar'
        };
        var obj2 = {
          baz: 'qux'
        };
        expect((0, _helpers.someInclude)([obj2], [obj1, obj2])).toBe(true);
      });
      test('should return true if lookIn contains a function from lookFor', () => {
        var func1 = () => {
          return true;
        };

        var func2 = () => {
          return false;
        };

        expect((0, _helpers.someInclude)([func2], [func1, func2])).toBe(true);
      });
      test('should return true if lookIn contains a null from lookFor', () => {
        expect((0, _helpers.someInclude)([null], ['foo', null])).toBe(true);
      });
      test('should return true if lookIn contains an undefined from lookFor', () => {
        expect((0, _helpers.someInclude)([undefined], ['foo', undefined])).toBe(true);
      });
    });
  });
});