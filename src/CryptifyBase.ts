import fs, { ReadStream, WriteStream } from 'fs';
import path from 'path';
import crypto, { Cipher, Decipher } from 'crypto';

import { getBufferLength, getSafePassword, isValidCipherAlgorithm, isValidPassword } from './util/funcs';
import { printPasswordRequirements, printRunHelp } from './util/logger/information';

import logger from './util/logger';

import { DEFAULT, IV_BLOCK_LENGTH } from './const';
import { CommandMode, StreamEvent, BufferEncoding } from './const/types';

const keySizeRegex = new RegExp(/\d+/);

class CryptifyBase {
  private readonly files: string[];
  private readonly password: string;
  private readonly algorithm: string;
  private readonly encoding: BufferEncoding;
  private readonly silent: boolean;
  private readonly loose: boolean;

  private readonly key: Buffer;

  private iv?: Buffer;
  private cipher?: Cipher | Decipher;
  private mode: CommandMode | undefined;
  private returnResults: boolean;
  private isModule: boolean;

  constructor(
    files: string[],
    password: string,
    algorithm: string,
    encoding: BufferEncoding,
    silent: boolean,
    loose: boolean
  ) {
    if (!crypto) {
      throw new Error('Node.js crypto lib not found');
    }
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a string');
    }

    if (algorithm && typeof algorithm === 'string') {
      this.algorithm = algorithm.toLowerCase();
    } else {
      this.algorithm = DEFAULT.CIPHER_ALGORITHM;
    }

    this.files = files;
    this.password = password;
    this.encoding = encoding || DEFAULT.ENCODING;
    this.silent = silent === true;
    this.loose = loose === true;

    this.key = this.getKey();

    this.isModule = false;
    this.returnResults = false;
  }

  /**
   * Set the command mode
   * @param mode
   */
  setMode(mode: CommandMode) {
    this.mode = mode;
  }

  /**
   * Set the isModule flag
   * @param isModule
   */
  setIsModule(isModule: boolean) {
    this.isModule = isModule;
  }

  /**
   * Set the return results
   * @param returnResults
   */
  setReturnResults(returnResults: boolean) {
    this.returnResults = returnResults;
  }

  /**
   * Determine if we're encrypting or decrypting
   * @returns {boolean}
   */
  isEncrypting() {
    if (!this.mode) {
      throw new Error(`Command method not set. Expecting "${CommandMode.Encrypt}" or ${CommandMode.Decrypt}`);
    }
    return this.mode === CommandMode.Encrypt;
  }

  /**
   * Get the verb for the command mode
   * @returns {string}
   */
  getModeVerb() {
    return this.isEncrypting() ? 'Encrypting' : 'Decrypting';
  }

  getKey() {
    const digestHash = crypto.createHash(DEFAULT.HASH_ALGORITHM).update(this.password).digest();

    const matches = this.algorithm.match(keySizeRegex);
    if (matches) {
      const keySize = parseInt(matches[0]);
      const length = getBufferLength(keySize);
      return Buffer.alloc(length, digestHash);
    }

    return digestHash;
  }

  /**
   * Ensure the file exist on the filesystem
   * @param files
   * @private
   */
  validateFiles(files: string[]) {
    if (!Array.isArray(files) || files.length === 0 || !files.every((file) => typeof file === 'string')) {
      throw new Error(`Must specify path(s) to file(s). ${printRunHelp(this.isModule, this.mode)}`);
    }
    files.forEach((file) => {
      const filePath = path.resolve(file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`No such file: ${file}`);
      }
    });
  }

  /**
   * Ensure the password meets complexity requirements
   * @param password
   * @private
   */
  validatePassword(password: string) {
    if (!password || typeof password !== 'string' || !isValidPassword(password)) {
      logger.blank();
      printPasswordRequirements();
      logger.blank();
      throw new Error(`Invalid password. ${printRunHelp(this.isModule, this.mode)}`);
    }
  }

  /**
   * Ensure the cipher is supported by OpenSSL
   * @param algorithm
   * @private
   */
  validateCipherAlgorithm(algorithm: string) {
    if (!algorithm || typeof algorithm !== 'string' || !isValidCipherAlgorithm(algorithm)) {
      throw new Error(`Invalid cipher: "${algorithm}", Run "cryptify --list"`);
    }
  }

  /**
   * Generate a cipher given a cipher algorithm, key and IV
   * @param iv
   * @returns {Cipher | Decipher}
   */
  generateCipher(iv: Buffer): Cipher | Decipher {
    return this.isEncrypting()
      ? crypto.createCipheriv(this.algorithm, this.key, iv)
      : crypto.createDecipheriv(this.algorithm, this.key, iv);
  }

  /**
   * Get input/output file paths
   * @param file
   * @returns {{iPath: string, oPath: string}}
   */
  getFilePaths(file: string): { iPath: string; oPath: string } {
    const iPath = path.join(file);
    const oPath = path.join(`${file}.${DEFAULT.EXTENSION}`);

    return { iPath, oPath };
  }

  /**
   * Get the encryption streams, and generate a random IV and
   * persist it to the output stream. We'll use the persisted IV
   * during the decryption process.
   * @param file
   * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
   */
  async getEncryptionStreams(
    file: string
  ): Promise<{ iStream: ReadStream; oStream: WriteStream; iPath: string; oPath: string }> {
    const { iPath, oPath } = this.getFilePaths(file);

    const iStream: ReadStream = fs.createReadStream(iPath);
    let oStream: WriteStream = fs.createWriteStream(oPath);

    this.iv = crypto.randomBytes(IV_BLOCK_LENGTH);
    this.cipher = this.generateCipher(this.iv);

    oStream.write(this.iv);

    return { iStream, oStream, iPath, oPath };
  }

  /**
   * Get the decryption streams, and obtain the IV from
   * the encrypted data. Use this persisted IV to generate
   * the cipher for decryption.
   * @param file
   * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
   */
  async getDecryptionSteams(
    file: string
  ): Promise<{ iStream: ReadStream; oStream: WriteStream; iPath: string; oPath: string }> {
    const { iPath, oPath } = this.getFilePaths(file);

    this.iv = await this.getIvFromStream(iPath);
    this.cipher = this.generateCipher(this.iv);

    return {
      iPath,
      oPath,
      oStream: fs.createWriteStream(oPath),
      iStream: fs.createReadStream(iPath, { start: IV_BLOCK_LENGTH }),
    };
  }

  /**
   * Get the IV that is stored within the encrypted file
   * @param inputPath
   * @returns {Promise<unknown>}
   */
  async getIvFromStream(inputPath: string): Promise<Buffer> {
    return new Promise((resolve) => {
      let iv: Buffer;
      fs.createReadStream(inputPath, { start: 0, end: IV_BLOCK_LENGTH - 1 })
        .on(StreamEvent.Data, (persistedIv: Buffer) => (iv = persistedIv))
        .on(StreamEvent.Close, () => resolve(iv));
    });
  }

  /**
   * Pipe the input stream into the output stream. During this
   * process we'll either be encrypting or decrypting.
   * @param iStream
   * @param oStream
   * @returns {Promise<unknown>}
   */
  async processStream(iStream: ReadStream, oStream: WriteStream): Promise<Error | null> {
    return new Promise((resolve, reject) => {
      iStream
        .pipe(this.cipher!)
        .on(StreamEvent.Error, (e: Error) => reject(e))
        .pipe(oStream)
        .on(StreamEvent.Close, () => resolve(null));
    });
  }

  getFilesSync() {
    return this.files.map((file) => fs.readFileSync(file, { encoding: this.encoding }));
  }

  /**
   * Run the encryption/decryption process
   * @returns {Promise<void>}
   */
  async execute() {
    try {
      this.validateFiles(this.files);

      /**
       * Don't validate password if loose is passed
       */
      if (!this.loose) {
        this.validatePassword(this.password);
      }

      this.validateCipherAlgorithm(this.algorithm);
    } catch (e) {
      return Promise.reject(e);
    }

    let filesRead = 0;

    if (!this.silent) {
      logger.blank();
      logger.info(`${this.getModeVerb()} ${this.files.length} file(s) with ${getSafePassword(this.password)}`);
      logger.info(`Cipher: ${this.algorithm}`);
      logger.info(`Encoding: ${this.encoding}`);
    }

    for (const file of this.files) {
      if (!this.silent) {
        logger.info(`Working on "${file}"`);
      }

      const streamsGetter = this.isEncrypting()
        ? this.getEncryptionStreams.bind(this)
        : this.getDecryptionSteams.bind(this);

      const { iStream, oStream, iPath, oPath } = await streamsGetter(file);

      const error = await this.processStream(iStream, oStream);
      if (error) {
        return Promise.reject(error);
      }

      fs.renameSync(oPath, iPath);

      if (++filesRead === this.files.length) {
        if (!this.silent) {
          logger.info('Processing complete');
        }
        const results = this.returnResults ? this.getFilesSync() : undefined;

        return Promise.resolve(results);
      }
    }
  }
}

export default CryptifyBase;
