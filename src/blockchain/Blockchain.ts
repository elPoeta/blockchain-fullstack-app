import cryptoHash from '../cryptoHash/cryptoHash';
import { Block } from './Block';

export class Blockchain {
    private _chain: Array<Block>
    constructor() {
        this._chain = [Block.genesis()];
    }

    addBlock(data: Array<String>) {
        const block = Block.mine(this._chain[this._chain.length - 1], data);
        this._chain.push(block);
    }

    static isValidChain(chain: Array<Block>): Boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for (let i = 1; i < chain.length; i++) {
            const { nonce, difficulty, timestamp, lastHash, hash, data } = chain[i];
            const actuaLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;
            if (lastHash !== actuaLastHash) return false;
            const validHash = cryptoHash(nonce, difficulty, timestamp, lastHash, ...data);
            if (hash !== validHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(chain: Array<Block>) {
        if (chain.length <= this._chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }
        console.log('The chain replace with ', chain);
        this._chain = chain;
    }

    get chain(): Array<Block> {
        return this._chain;
    }
}