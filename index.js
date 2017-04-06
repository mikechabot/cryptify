#!/usr/bin/env node

const cryptify = require('./lib/cryptify');
cryptify(process.argv.slice(2));
