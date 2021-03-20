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

    get chain(): Array<Block> {
        return this._chain;
    }
}