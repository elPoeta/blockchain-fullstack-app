import { GENESIS_DATA } from '../config/config';
import { Block } from './Block';
describe('Block', () => {
    const timestamp: Date = new Date();
    const lastHash: String = 'elPoeta-lastHash';
    const hash: String = 'elPoeta-hash';
    const data: Array<String> = ['elPoeta'];
    const block = new Block(timestamp, lastHash, hash, data);
    it('has a timestamp, lastHash, hash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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
    })
})