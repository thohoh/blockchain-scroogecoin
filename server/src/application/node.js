import { Blockchain } from './blockchain';
import { nodeConfig } from '../../config/node-config.json';

export class Node {
    constructor(blockchain, config) {
        this._blockchain = blockchain;
        this._config = config;
        this._transactions = [];
    }

    addTransaction(transaction) {
        this._transactions.push(transaction);
    }

    clearTransactions() {
        this._transactions = [];
    }

    mine() {
        const lastBlock = this._blockchain.getLastBlock();
        const lastProof = lastBlock.getProof();
        const proof = this.createProofOfWork(lastProof);

        this.addTransaction({
            from: 'network',
            to: this._config.minerAddress,
            amount: 1
        });

        const newBlockData = {
            proof: proof,
            transactions: this._transactions
        };

        const nextBlock = this._blockchain.createNextBlock(lastBlock, newBlockData);
        this._blockchain.addBlock(nextBlock);

        return nextBlock;
    }

    createProofOfWork(lastProof) {
        let incrementor = lastProof + 1;

        while(
            ((incrementor % 9) !== 0) &&
            ((incrementor % lastProof) !== 0)
        ) {
            incrementor += 1;
        }

        return incrementor;
    }
}

export const node = new Node(new Blockchain(), nodeConfig);