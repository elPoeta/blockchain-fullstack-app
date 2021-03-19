import { Block } from './Block';
describe('Block', () => {
    const timestamp: Date = new Date();
    const lastHash: String = 'elPoeta-lastHash';
    const hash: String = 'elPoeta-hash';
    const data: String = 'elPoeta';
    const block = new Block(timestamp, lastHash, hash, data);
    it('has a timestamp, lastHash, hash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });
})