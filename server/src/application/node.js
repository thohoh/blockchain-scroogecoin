import { Injectable, Inject } from 'container-ioc';

import { Blockchain } from './blockchain/blockchain';
import { Block } from "./blockchain/block";
import { EventEmitter } from '../lib/event-emitter';
import {Configuration} from "../system/configuration";

@Injectable([Blockchain, Configuration])
export class Node {
    static TRANSACTIONS_PER_BLOCK_LIMIT = 2;

    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(Configuration) config
    ) {
        this._config = config.node;
        this._blockchain = blockchain;

        this._transactions = [];

        this.blockMined = new EventEmitter();
        this.newTransaction = new EventEmitter();

        this.init();
    }

    init() {
        this._blockchain.addBlock(this._createGenesysBlock());
    }

    getBlocks() {
        return this._blockchain.getBlocks();
    }

    validateBlock(newBlock, previousBlock) {
        if (newBlock.index !== (previousBlock.index + 1)) {
            return false;
        }

        if (newBlock.previousBlockHash !== previousBlock.hash) {
            return false;
        }

        if (Block.createHash(newBlock) !== newBlock.hash) {
            return false;
        }

        return true;
    }

    addTransaction(transaction) {
        this._transactions.push(transaction);

        if (this._transactions.length === Node.TRANSACTIONS_PER_BLOCK_LIMIT) {
            this.mine();
        }
    }

    clearTransactions() {
        this._transactions = [];
    }

    mine() {
        const lastBlock = this._blockchain.getLatestBlock();
        const lastProof = lastBlock.data.proof;

        this.addTransaction({
            from: 'network',
            to: this._config.minerAddress,
            amount: 1
        });

        const proof = this._createProofOfWork(lastProof);

        const newBlockData = {
            proof: proof,
            transactions: this._transactions
        };

        const newBlock = this._createNextBlock(lastBlock, newBlockData);
        this._blockchain.addBlock(newBlock);

        this.clearTransactions();

        this.blockMined.emit(newBlock);

        return newBlock;
    }

    _createGenesysBlock() {
        const genesysData = {
            proof: 0,
            transactions: []
        };

        return new Block(0, '0', genesysData, '0');
    }

    _createNextBlock(prevBlock, data) {
        const index = (prevBlock.index + 1);
        const date = new Date();

        return new Block(index, date, data, prevBlock.hash);
    }

    _createProofOfWork(lastProof) {
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