import * as path from 'path';
import { IConfiguration, IP2PConfiguration, IServerConfiguration } from './configuration.interface';
import { Component } from '@nestjs/common';
import { Environment } from './environment/environment';
import { EnvType } from './environment/environment.interface';

@Component()
export class Configuration implements IConfiguration {
    public genesisPublicKey: string;
    public genesisPrivateKey: string;
    public minerPublicKey: string;

    public rootPath: string;
    public server: IServerConfiguration;
    public p2p: IP2PConfiguration;

    public storagePath: string;
    public mode: string;

    constructor(
       private env: Environment
    ) {
        this.mode = this.env.mode;
        const config = this.loadConfigFile();
        this.applyConfig(config);
    }
    
    public applyConfig(config: IConfiguration): void {
        this.genesisPublicKey = config.genesisPublicKey;
        this.genesisPrivateKey = config.genesisPrivateKey;
        this.minerPublicKey = config.minerPublicKey;

        this.rootPath = path.join(__dirname, '../../', config.rootPath);
        this.server = {
            host: this.env.serverHost ? this.env.serverHost : config.server.host,
            port: this.env.serverPort ?  this.env.serverPort : config.server.port,
            apiDocsRoute: config.server.apiDocsRoute
        };
        this.p2p = {
            host: this.env.p2pHost ? this.env.p2pHost : config.p2p.host,
            port: this.env.p2pPort ? this.env.p2pPort : config.p2p.port,
            peers: this.env.p2pPeers ? this.env.p2pPeers.split(',') : []
        };

        this.storagePath = path.join(this.rootPath, config.storagePath);
    }

    private loadConfigFile(): IConfiguration {
        const configType: EnvType = (this.env.config ? this.env.config : 'local');
        const configName: string = `${configType}-config.json`;
        const configPath: string = path.join('../../config', configName);
        return require(configPath);
    }
}