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
            const { timestamp, lastHash, hash, data } = chain[i];
            const actuaLastHash = chain[i - 1].hash;
            if (lastHash !== actuaLastHash) return false;
            const validHash = cryptoHash(timestamp.toString(), lastHash, ...data);
            if (hash !== validHash) return false;
        }
        return true;
    }

    get chain(): Array<Block> {
        return this._chain;
    }
}