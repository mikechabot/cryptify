import {
    hasLowerCase,
    hasNumber,
    hasUpperCase,
    someInclude
} from '../helpers';

describe('Helper Funcs', () => {
    describe('hasLowerCase', () => {
        test('should be a function', () => {
            expect(typeof hasLowerCase).toEqual('function');
        });
        test('should return false if undefined is passed', () => {
            expect(hasLowerCase(undefined)).toBe(false);
        });
        test('should return false if null is passed', () => {
            expect(hasLowerCase(null)).toBe(false);
        });
        test('should return false if a number is passed', () => {
            expect(hasLowerCase(1)).toBe(false);
        });
        test('should return false if an array is passed', () => {
            expect(hasLowerCase([])).toBe(false);
        });
        test('should return false if an object is passed', () => {
            expect(hasLowerCase({})).toBe(false);
        });
        test('should return false if a function is passed', () => {
            expect(hasLowerCase(() => {})).toBe(false);
        });
        test('should return false if a string number is passed', () => {
            expect(hasLowerCase('1')).toBe(false);
        });
        test('should return false if no lowercase is passed', () => {
            expect(hasLowerCase('A')).toBe(false);
        });
        test('should return true if lowercase is passed', () => {
            expect(hasLowerCase('a')).toBe(true);
        });
    });
    describe('hasUpperCase', () => {
        test('should be a function', () => {
            expect(typeof hasUpperCase).toEqual('function');
        });
        test('should return false if undefined is passed', () => {
            expect(hasUpperCase(undefined)).toBe(false);
        });
        test('should return false if null is passed', () => {
            expect(hasUpperCase(null)).toBe(false);
        });
        test('should return false if a number is passed', () => {
            expect(hasUpperCase(1)).toBe(false);
        });
        test('should return false if an array is passed', () => {
            expect(hasUpperCase([])).toBe(false);
        });
        test('should return false if an object is passed', () => {
            expect(hasUpperCase({})).toBe(false);
        });
        test('should return false if a function is passed', () => {
            expect(hasUpperCase(() => {})).toBe(false);
        });
        test('should return false if a string number is passed', () => {
            expect(hasUpperCase('1')).toBe(false);
        });
        test('should return false if no uppercase is passed', () => {
            expect(hasUpperCase('a')).toBe(false);
        });
        test('should return true if uppercase is passed', () => {
            expect(hasUpperCase('A')).toBe(true);
        });
    });
    describe('hasNumber', () => {
        test('should be a function', () => {
            expect(typeof hasNumber).toEqual('function');
        });
        test('should return false if undefined is passed', () => {
            expect(hasNumber(undefined)).toBe(false);
        });
        test('should return false if null is passed', () => {
            expect(hasNumber(null)).toBe(false);
        });
        test('should return false if a number is passed', () => {
            expect(hasNumber(1)).toBe(false);
        });
        test('should return false if an array is passed', () => {
            expect(hasNumber([])).toBe(false);
        });
        test('should return false if an object is passed', () => {
            expect(hasNumber({})).toBe(false);
        });
        test('should return false if a function is passed', () => {
            expect(hasNumber(() => {})).toBe(false);
        });
        test('should return false if a string with no number is passed', () => {
            expect(hasNumber('a')).toBe(false);
        });
        test('should return true if a string with a number is passed', () => {
            expect(hasNumber('1')).toBe(true);
        });
    });
    describe('someInclude', () => {
        test('should be a function', () => {
            expect(typeof someInclude).toEqual('function');
        });
        describe('lookIn is invalid and lookFor is valid', () => {
            test('should return false if lookIn is undefined and lookFor is a populated array', () => {
                expect(someInclude(undefined, ['foo'])).toBe(false);
            });
            test('should return false if lookIn is null and lookFor is a populated array', () => {
                expect(someInclude(null, ['foo'])).toBe(false);
            });
            test('should return false if lookIn is a number and lookFor is a populated array', () => {
                expect(someInclude(1, ['foo'])).toBe(false);
            });
            test('should return false if lookIn is an empty array and lookFor is a populated array', () => {
                expect(someInclude([], ['foo'])).toBe(false);
            });
            test('should return false if lookIn is an object and lookFor is a populated array', () => {
                expect(someInclude({}, ['foo'])).toBe(false);
            });
            test('should return false if lookIn is a function and lookFor is a populated array', () => {
                expect(someInclude(() => {}, ['foo'])).toBe(false);
            });
            test('should return false if lookIn is a string and lookFor is a populated array', () => {
                expect(someInclude('a', ['foo'])).toBe(false);
            });
        });
        describe('lookIn is valid and lookFor is invalid', () => {
            test('should return false if lookFor is undefined and lookIn is a populated array', () => {
                expect(someInclude(['foo'], undefined)).toBe(false);
            });
            test('should return false if lookFor is null and lookIn is a populated array', () => {
                expect(someInclude(['foo'], null)).toBe(false);
            });
            test('should return false if lookFor is a number and lookIn is a populated array', () => {
                expect(someInclude(['foo'], 1)).toBe(false);
            });
            test('should return false if lookFor is an empty array and lookIn is a populated array', () => {
                expect(someInclude(['foo'], [])).toBe(false);
            });
            test('should return false if lookFor is an object and lookIn is a populated array', () => {
                expect(someInclude(['foo'], {})).toBe(false);
            });
            test('should return false if lookFor is a function and lookIn is a populated array', () => {
                expect(someInclude(['foo'], () => {})).toBe(false);
            });
            test('should return false if lookFor is a string and lookIn is a populated array', () => {
                expect(someInclude(['foo'], 'a')).toBe(false);
            });
        });
        describe('lookIn is invalid and lookFor is invalid', () => {
            test('should return false if lookIn and lookFor are undefined', () => {
                expect(someInclude(undefined, undefined)).toBe(false);
            });
            test('should return false if lookIn and lookFor are null', () => {
                expect(someInclude(null, null)).toBe(false);
            });
            test('should return false if lookIn and lookFor are numbers', () => {
                expect(someInclude(1, 1)).toBe(false);
            });
            test('should return false if lookIn and lookFor are empty arrays', () => {
                expect(someInclude([], [])).toBe(false);
            });
            test('should return false if lookIn and lookFor are object', () => {
                expect(someInclude({}, {})).toBe(false);
            });
            test('should return false if lookIn and lookFor are functions', () => {
                expect(someInclude(() => {}, () => {})).toBe(false);
            });
            test('should return false if lookIn and lookFor are strings', () => {
                expect(someInclude('a', 'a')).toBe(false);
            });
        });
        describe('lookIn is valid and lookFor is valid', () => {
            test('should return true if lookIn contains a number from lookFor', () => {
                expect(someInclude([2], [1, 2])).toBe(true);
            });
            test('should return true if lookIn contains a string from lookFor', () => {
                expect(someInclude(['2'], ['1', '2'])).toBe(true);
            });
            test('should return true if lookIn contains an object from lookFor', () => {
                const obj1 = {foo: 'bar'};
                const obj2 = {baz: 'qux'};
                expect(someInclude([obj2], [obj1, obj2])).toBe(true);
            });
            test('should return true if lookIn contains a function from lookFor', () => {
                const func1 = () => { return true; };
                const func2 = () => { return false; };
                expect(someInclude([func2], [func1, func2])).toBe(true);
            });
            test('should return true if lookIn contains a null from lookFor', () => {
                expect(someInclude([null], ['foo', null])).toBe(true);
            });
            test('should return true if lookIn contains an undefined from lookFor', () => {
                expect(someInclude([undefined], ['foo', undefined])).toBe(true);
            });
        });
    });
});
