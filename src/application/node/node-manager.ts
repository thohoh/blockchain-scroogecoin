import { Component } from '@nestjs/common';
import { IBlock } from '../block/block.interface';
import { Node } from './node';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';

@Component()
export class NodeManager {
    constructor(
        private node: Node
    ) { }

    async getBlocks(): Promise<IBlock[]> {
        return this.node.getBlocks();
    }

    async getLastBlock(): Promise<IBlock> {
        return this.node.getLastBlock();
    }

    async getUnspentTxOutputs(): Promise<UnspentTransactionOutput[]> {
        return this.node.getUnspentTxOutputs();
    }
}