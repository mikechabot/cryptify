#!/usr/bin/env node

const cryptify = require('./lib/cli');
cryptify(process.argv.slice(2));

// Changing file encoding to UTF-8 to possibly fix file line ending problems
