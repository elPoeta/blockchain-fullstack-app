import { Blockchain } from './Blockchain'
import { Block } from './Block'

describe('Blockchain', () => {
    const blockchain = new Blockchain();

    it('contains a chain instance array', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    })

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('add new block to the chain', () => {
        const newData = ['first chain'];
        blockchain.addBlock(newData);
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    })
})