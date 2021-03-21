import { GENESIS_DATA, MINE_RATE } from '../config/config';
import cryptoHash from '../cryptoHash/cryptoHash';
import { hexToBinary } from '../utils/hexToBinary';

export class Block {
    constructor(private _nonce: number, private _difficulty: number, private _timestamp: number, private _lastHash: String, private _hash: String, private _data: Array<String>) { }

    static genesis(): Block {
        const { nonce, difficulty, timestamp, lastHash, hash, data } = GENESIS_DATA;
        return new this(nonce, difficulty, timestamp, lastHash, hash, data);
    }

    static mine(lastBlock: Block, newData: Array<String>): Block {
        let timestamp: number;
        let hash: String;
        let nonce = 0;
        const lastHash = lastBlock.hash;
        let difficulty = lastBlock.difficulty;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = cryptoHash(nonce, difficulty, timestamp, lastHash, ...newData);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(nonce, difficulty, timestamp, lastHash, hash, newData);
    }

    static adjustDifficulty(originalBlock: Block, timestamp: number): number {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;
        if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }

    get nonce(): number {
        return this._nonce;
    }

    set nonce(nonce: number) {
        this._nonce = nonce;
    }

    get difficulty(): number {
        return this._difficulty;
    }

    set difficulty(difficulty: number) {
        this._difficulty = difficulty;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    set timestamp(timestamp: number) {
        this._timestamp = timestamp;
    }


    get lastHash(): String {
        return this._lastHash;
    }

    set lastHash(lastHash: String) {
        this._lastHash = lastHash;
    }

    get hash(): String {
        return this._hash;
    }

    set hash(hash: String) {
        this._hash = hash;
    }

    get data(): Array<String> {
        return this._data;
    }

    set data(data: Array<String>) {
        this._data = data;
    }

}



