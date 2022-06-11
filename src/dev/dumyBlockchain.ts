import { Blockchain } from "../model/Blockchain";
import { TransactionMiner } from "../model/TransactionMiner";
import { TransactionPool } from "../model/TransactionPool";
import { Wallet } from "../model/Wallet";
export const setDummyBlocks = (
  isDevelopment: boolean,
  wallet: Wallet,
  blockchain: Blockchain,
  transactionPool: TransactionPool,
  transactionMiner: TransactionMiner
) => {
  if (isDevelopment) {
    const walletFoo: Wallet = new Wallet();
    const walletBar: Wallet = new Wallet();

    const generateWalletTransaction = ({
      wallet,
      recipient,
      amount,
    }: {
      wallet: Wallet;
      recipient: string;
      amount: number;
    }) => {
      const transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });

      transactionPool.setTransaction(transaction);
    };

    const walletAction = () =>
      generateWalletTransaction({
        wallet,
        recipient: walletFoo.publicKey,
        amount: 5,
      });

    const walletFooAction = () =>
      generateWalletTransaction({
        wallet: walletFoo,
        recipient: walletBar.publicKey,
        amount: 10,
      });

    const walletBarAction = () =>
      generateWalletTransaction({
        wallet: walletBar,
        recipient: wallet.publicKey,
        amount: 15,
      });

    for (let i = 0; i < 20; i++) {
      if (i % 3 === 0) {
        walletAction();
        walletFooAction();
      } else if (i % 3 === 1) {
        walletAction();
        walletBarAction();
      } else {
        walletFooAction();
        walletBarAction();
      }

      transactionMiner.mineTransactions();
    }
  }
};
