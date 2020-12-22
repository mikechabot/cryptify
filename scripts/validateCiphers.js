import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import CryptifyModule from '../lib/CryptifyModule';
import logger from '../lib/util/logger';

const ciphers = crypto.getCiphers();

const TEST_DATA = 'test-data';
const TEST_DIRECTORY = 'validated-ciphers';
const PASSWORD = 'Secret123!';

if (!fs.existsSync(TEST_DIRECTORY)) {
  fs.mkdirSync(TEST_DIRECTORY);
}

function createDummyFileAndReturnPath(cipher) {
  const filename = `${cipher}.txt`;
  const filepath = path.join(TEST_DIRECTORY, filename);
  try {
    fs.appendFileSync(filepath, TEST_DATA);
  } catch (err) {
    logger.error(`Unable to create/write to ${filename}`);
  }

  return filepath;
}

const executionsByCipher = {};

for (const cipher of ciphers) {
  const filepath = createDummyFileAndReturnPath(cipher);
  executionsByCipher[cipher] = new CryptifyModule(filepath, PASSWORD, cipher);
}

const cipherKeys = Object.keys(executionsByCipher);

const encrypts = cipherKeys.map((cipher) => {
  const instance = executionsByCipher[cipher];
  return new Promise((resolve) => {
    try {
      return instance
        .encrypt()
        .then(() => instance.decrypt())
        .then((files) => resolve(files[0] === TEST_DATA))
        .catch(() => resolve(false));
    } catch (e) {
      return resolve(false);
    }
  });
});

logger.blank();
logger.log('Running cipher validation tests...');
logger.blank();

Promise.all(encrypts).then((results = []) => {
  let successes = 0;
  results.forEach((r, i) => {
    const cipher = cipherKeys[i];
    if (results[i]) {
      logger.info(`Passed: ${cipher}`);
      successes += 1;
    }
  });

  logger.blank();
  logger.info(`Results: ${successes} passed, ${results.length - successes} total`);
});
