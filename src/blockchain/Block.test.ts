import { GENESIS_DATA, MINE_RATE } from '../config/config';
import cryptoHash from '../cryptoHash/cryptoHash';
import { Block } from './Block';
describe('Block', () => {
    const timestamp: number = 2000;
    const lastHash: String = 'elPoeta-lastHash';
    const hash: String = 'elPoeta-hash';
    const data: Array<String> = ['elPoeta', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block(nonce, difficulty, timestamp, lastHash, hash, data);
    it('has a timestamp, lastHash, hash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        })

        it('returns the genesis data', () => {
            expect(genesisBlock.hash).toEqual(GENESIS_DATA.hash);
            expect(genesisBlock.lastHash).toEqual(GENESIS_DATA.lastHash);
            expect(genesisBlock.timestamp).toEqual(GENESIS_DATA.timestamp);
            expect(genesisBlock.data).toEqual(GENESIS_DATA.data);
        })
    });

    describe('mine()', () => {
        const lastBlock = Block.genesis();
        const data = ['mined-block'];
        const minedBlock = Block.mine(lastBlock, data);

        it('returns a block instance', () => {
            expect(lastBlock instanceof Block).toBe(true);
        })

        it('set the `lastHash to be the hash of the lastBlock`', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        })

        it('set data', () => {
            expect(minedBlock.data).toEqual(data);
        })

        it('set timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        })

        it('create hash based on inputs', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.nonce, minedBlock.difficulty, minedBlock.timestamp, minedBlock.lastHash, ...data));
        })
        it('set hash that macht the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        })
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for quickly mined block', () => {
            expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE - 100)).toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for slowly mined block', () => {
            expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE + 100)).toEqual(block.difficulty - 1);


        });
    })
})