export interface IConfiguration {
    creatorPublicAddress: string;
    creatorPrivateAddress;
    minerPublicAddress: string;

    rootPath: string;
    server: IServerConfiguration;
    p2p: IP2PConfiguration;
    storagePath: string;
}

export interface IServerConfiguration {
    apiDocsRoute: string;
    host: string;
    port: number;
}

export interface IP2PConfiguration {
    host: string;
    port: number;
    peers: string[];
}