import CryptifyBase from './CryptifyBase';
import { CommandMode } from './const/types';

interface OptionsMap {
  [key: string]: any;
}

class CryptifyCli extends CryptifyBase {
  constructor(mode: CommandMode, options: OptionsMap) {
    const { args, password, cipher, encoding, silent, loose } = options;

    super(args, password, cipher, encoding, silent, loose);

    this.setMode(mode);
    this.setReturnResults(false);
  }
}

export default CryptifyCli;
