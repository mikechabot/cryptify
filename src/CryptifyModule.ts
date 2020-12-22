import CryptifyBase from './CryptifyBase';
import { CommandMode, BufferEncoding } from './const/types';

export { BufferEncoding } from './const/types';

class CryptifyModule extends CryptifyBase {
  constructor(
    files: string | string[],
    password: string,
    cipher: string,
    encoding: BufferEncoding,
    silent: boolean,
    loose: boolean
  ) {
    super(typeof files === 'string' ? [files] : files, password, cipher, encoding, silent, loose);

    this.setIsModule(true);
    this.setReturnResults(true);
  }

  encrypt() {
    this.setMode(CommandMode.Encrypt);
    return this.execute();
  }

  decrypt() {
    this.setMode(CommandMode.Decrypt);
    return this.execute();
  }
}

export default CryptifyModule;
