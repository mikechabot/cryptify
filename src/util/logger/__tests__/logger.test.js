import logger from '../index';

const {
    blank,
    info,
    error,
    log,
} = logger;

describe('Logger Funcs', () => {

    let consoleSpy = null;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('blank', () => {
        test('should be a function', () => {
            expect(typeof blank).toEqual('function');
        });
        test('should call console.log', () => {
            blank();
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
        test('should call console.log with nothing when nothing is passed', () => {
            blank();
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith('');
        });
        test('should call console.log with nothing when something is passed', () => {
            blank('foo');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith('');
        });
    });
    describe('info', () => {
        test('should be a function', () => {
            expect(typeof info).toEqual('function');
        });
        test('should not call console.log when nothing is passed', () => {
            info();
            expect(consoleSpy).toHaveBeenCalledTimes(0);
        });
        test('should not call console.log when null is passed', () => {
            info(null);
            expect(consoleSpy).toHaveBeenCalledTimes(0);
        });
        test('should not call console.log when undefined is passed', () => {
            info(undefined);
            expect(consoleSpy).toHaveBeenCalledTimes(0);
        });
        test('should call console.log with the passed string and a check', () => {
            info('foo');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2713 foo');
        });
        test('should call console.log with the passed number and a check', () => {
            info(123);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2713 123');
        });
    });
    describe('error', () => {
        test('should be a function', () => {
            expect(typeof error).toEqual('function');
        });
        test('should call console.log with the default message when nothing is passed', () => {
            error();
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 An error has occurred');
        });
        test('should call console.log with the default message when null is passed', () => {
            error(null);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 An error has occurred');
        });
        test('should call console.log with the default message when defined is passed', () => {
            error(undefined);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 An error has occurred');
        });
        test('should call console.log with the default message when a string is passed', () => {
            error('foo');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 An error has occurred');
        });
        test('should call console.log with the default message when a number is passed', () => {
            error(123);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 An error has occurred');
        });
        test('should call console.log with the error message', () => {
            error(new Error('foobar'));
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(' \u2718 foobar');
        });
    });
    describe('log', () => {
        test('should be a function', () => {
            expect(typeof log).toEqual('function');
        });
        test('should call console.log when nothing is passed', () => {
            log();
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
        test('should call console.log when null is passed', () => {
            log(null);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
        test('should call console.log when undefined is passed', () => {
            log(undefined);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
        test('should call console.log with the passed string and a check', () => {
            log('foo');
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith('foo');
        });
        test('should call console.log with the passed number and a check', () => {
            log(123);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenLastCalledWith(123);
        });
    });
});
