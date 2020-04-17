import BaseCryptify from './BaseCryptify';

class CryptifyCli extends BaseCryptify {
    constructor(mode, options) {
        const {args, password, cipher, encoding} = options;

        super(args, password, cipher, encoding);

        this.mode = mode;
        this.returnResults = false;
    }
}

export default CryptifyCli;
