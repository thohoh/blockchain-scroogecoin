import { Module } from '@nestjs/common';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TransactionPoolModule } from '../transaction-pool/transaction-pool.module';
import { BlockModule } from '../block/block.module';
import { NodeManager } from './node-manager';
import { SystemModule } from '../../system/system.module';
import { UnspentTransactionOutputsModule } from '../unspent-transaction-outputs/unspent-transaction-outputs.module';
import { TransactionModule } from '../transaction/transaction.module';
import { P2P_PROVIDERS } from '../p2p-network/p2p-providers';
import { Node } from './node';
import { MiningHelpersService } from './mining-helpers.service';
import { Scheduler } from './scheduler/scheduler';
import { schedulerProvider } from './scheduler/scheduler-provider';
import { DumbScheduler } from './scheduler/dumb-scheduler';

@Module({
    imports: [
        BlockchainModule,
        UnspentTransactionOutputsModule,
        TransactionModule,
        TransactionPoolModule,
        BlockModule,
        SystemModule
    ],
    components: [
        Node,
        NodeManager,
        Scheduler,
        DumbScheduler,
        schedulerProvider,
        MiningHelpersService,
        ...P2P_PROVIDERS
    ],
    exports: [
        NodeManager,
        Node,
        ...P2P_PROVIDERS
    ]
})
export class NodeModule {

}