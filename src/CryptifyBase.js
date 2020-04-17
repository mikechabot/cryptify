import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import logger from './util/logger';

import {isValidCipherAlgorithm, isValidPassword, getSafePassword} from './util/funcs';
import {printPasswordRequirements, printRunHelp} from './util/logger/information';

import {COMMAND_MODE, DEFAULT, IV_BLOCK_LENGTH, STREAM_EVENT} from './const';

class CryptifyBase {
    constructor (files, password, algorithm, encoding) {
        if (!crypto) {
            throw new Error('Node.js crypto lib not found');
        }
        if (!password || typeof password !== 'string') {
            throw new Error('Password must be a string');
        }

        this.files = files;
        this.password = password;
        this.algorithm = algorithm || DEFAULT.CIPHER_ALGORITHM;
        this.encoding = encoding || DEFAULT.ENCODING;

        this.key = crypto
            .createHash(DEFAULT.HASH_ALGORITHM)
            .update(this.password)
            .digest();

        this.isModule = false;

        this.iv = null;
        this.mode = null;
        this.cipher = null;
        this.returnResults = null;
    }

    /**
     * Determine if we're encrypting or decrypting
     * @returns {boolean}
     */
    isEncrypting() {
        if (!this.mode) {
            throw new Error(`Command method not set. Expecting "${COMMAND_MODE.ENCRYPT}" or ${COMMAND_MODE.DECRYPT}`);
        }
        return this.mode === COMMAND_MODE.ENCRYPT;
    }

    /**
     * Get the verb for the command mode
     * @returns {string}
     */
    getModeVerb() {
        return this.isEncrypting() ? 'Encrypting' : 'Decrypting';
    }

    /**
     * Ensure the file exist on the filesystem
     * @param files
     * @private
     */
    validateFiles (files) {
        if (!Array.isArray(files)
            || files.length === 0
            || !files.every(file => typeof file === 'string')) {
            throw new Error(`Must specify path(s) to file(s). ${printRunHelp(this.isModule, this.mode)}`);
        }
        files.forEach(file => {
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
    validatePassword (password) {
        if (!password ||
            typeof password !== 'string' ||
            !isValidPassword(password)
        ) {
            logger.blank();
            printPasswordRequirements();
            logger.blank();
            throw new Error(`Invalid password. ${printRunHelp(this.isModule, this.mode)}`);
        }
    }

    /**
     * Ensure the cipher is supported by OpenSSL
     * @param cipher
     * @private
     */
    validateCipherAlgorithm (algorithm) {
        if (!algorithm ||
            typeof algorithm !== 'string' ||
            !isValidCipherAlgorithm(algorithm)
        ) {
            throw new Error(`Invalid cipher: "${algorithm}", Run "cryptify --list"`);
        }
    }

    /**
     * Generate a cipher given a cipher algorithm, key and IV
     * @param iv
     * @returns {any}
     */
    generateCipher(iv) {
        return this.isEncrypting()
            ? crypto.createCipheriv(this.algorithm, this.key, iv)
            : crypto.createDecipheriv(this.algorithm, this.key, iv);
    }

    /**
     * Get input/output file paths
     * @param file
     * @returns {{iPath: string, oPath: string}}
     */
    getFilePaths(file) {
        const iPath = path.join(file);
        const oPath = path.join(`${file}.${DEFAULT.EXTENSION}`);

        return {iPath, oPath};
    }

    /**
     * Get the encryption streams, and generate a random IV and
     * persist it to the output stream. We'll use the persisted IV
     * during the decryption process.
     * @param file
     * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
     */
    async getEncryptionStreams(file) {
        const {iPath, oPath} = this.getFilePaths(file);

        const iStream = fs.createReadStream(iPath);
        let oStream = fs.createWriteStream(oPath);

        this.iv = crypto.randomBytes(IV_BLOCK_LENGTH);
        this.cipher = this.generateCipher(this.iv);

        oStream.write(this.iv);

        return {iStream, oStream, iPath, oPath};
    }

    /**
     * Get the decryption streams, and obtain the IV from
     * the encrypted data. Use this persisted IV to generate
     * the cipher for decryption.
     * @param file
     * @returns {Promise<{iStream: ReadStream, oStream: WriteStream, iPath: string, oPath: string}>}
     */
    async getDecryptionSteams(file) {
        const {iPath, oPath} = this.getFilePaths(file);

        this.iv = await this.getIvFromStream(iPath);
        this.cipher = this.generateCipher(this.iv);

        return {
            iPath,
            oPath,
            oStream: fs.createWriteStream(oPath),
            iStream: fs.createReadStream(iPath, {start: IV_BLOCK_LENGTH})
        };
    }

    /**
     * Get the IV that is stored within the encrypted file
     * @param inputPath
     * @returns {Promise<unknown>}
     */
    async getIvFromStream(inputPath) {
        return new Promise(resolve => {
            let iv = null;
            fs.createReadStream(inputPath, {start: 0, end: IV_BLOCK_LENGTH - 1})
                .on(STREAM_EVENT.DATA, persistedIv => iv = persistedIv)
                .on(STREAM_EVENT.CLOSE, () => resolve(iv));
        });
    }

    /**
     * Pipe the input stream into the output stream. During this
     * process we'll either be encrypting or decrypting.
     * @param iStream
     * @param oStream
     * @returns {Promise<unknown>}
     */
    async processStream(iStream, oStream) {
        return new Promise((resolve, reject) => {
            iStream
                .pipe(this.cipher)
                .on(STREAM_EVENT.ERROR, e => reject(e))
                .pipe(oStream)
                .on(STREAM_EVENT.CLOSE, () => resolve(null));
        });
    }

    getFilesSync() {
        return this.files.map(file => fs.readFileSync(file, this.encoding));
    }

    /**
     * Run the encryption/decryption process
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            this.validateFiles(this.files);
            this.validatePassword(this.password);
            this.validateCipherAlgorithm(this.algorithm);
        } catch (e) {
            return Promise.reject(e);
        }

        let filesRead = 0;

        logger.blank();
        logger.info(`${this.getModeVerb()} ${this.files.length} file(s) with ${getSafePassword(this.password)}`);
        logger.info(`Cipher: ${this.algorithm}`);
        logger.info(`Encoding: ${this.encoding}`);

        for (const file of this.files) {

            logger.info(`Working on "${file}"`);

            const streamsGetter = this.isEncrypting()
                ? this.getEncryptionStreams.bind(this)
                : this.getDecryptionSteams.bind(this);

            const {iStream, oStream, iPath, oPath} = await streamsGetter(file);

            const error = await this.processStream(iStream, oStream);
            if (error) {
                return Promise.reject(error);
            }

            fs.renameSync(oPath, iPath);

            if (++filesRead === this.files.length) {
                logger.info('Processing complete');

                const results = this.returnResults
                    ? this.getFilesSync()
                    : undefined;

                return Promise.resolve(results);
            }
        }
    }
}

export default CryptifyBase;
