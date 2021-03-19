import { Block } from './blockchain/Block';
console.log('app run...')
const block1 = new Block(new Date(), 'elPoeta-hash', 'elPoeta-lastHash', 'elPoeta');
console.log(block1);