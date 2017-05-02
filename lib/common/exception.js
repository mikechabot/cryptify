'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function CryptifyException(message) {
    this.message = message || 'An error occurred';
    this.name = 'CryptifyException';
    this.stack = new Error().stack;
}

// Inherit from Error constructor
CryptifyException.prototype = Object.create(Error.prototype);
CryptifyException.prototype.constructor = CryptifyException;

exports.default = CryptifyException;