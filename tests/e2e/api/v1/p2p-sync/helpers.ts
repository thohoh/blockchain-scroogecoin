import { IServer } from '../../../../../src/server/server.interface';
import { Server } from '../../../../../src/server/server';
import accounts from '../../../../helpers/test-accounts';

export const createWsAddressFromConfig = (config): string => {
    return `ws://${config.p2p.host}:${config.p2p.port}`;
};

export const startServer = async (config): Promise<IServer> => {
    const server = new Server();

    await server.init();

    server.config.mode = 'test';
    server.config.server.host = config.server.host;
    server.config.server.port = config.server.port;

    server.config.p2p.host = config.p2p.host;
    server.config.p2p.port = config.p2p.port;
    server.config.p2p.peers = config.p2p.peers;

    server.config.genesisPrivateKey = accounts.genesis.privateKey;
    server.config.genesisPublicKey = accounts.genesis.publicKey;

    await server.start();

    return server;
};

export const stopServer = async (server: IServer): Promise<void> => {
    await server.stop();
};