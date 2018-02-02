import * as path from 'path';
import { IConfiguration, IP2PConfiguration, IServerConfiguration } from './configuration.interface';
import { Component } from '@nestjs/common';
import { Environment } from '../system/environment/environment';
import { EnvType } from '../system/environment/environment.interface';

@Component()
export class Configuration implements IConfiguration {

    public rootPath: string;
    public server: IServerConfiguration;
    public p2p: IP2PConfiguration;
    public creatorPublicKey: string;
    public storagePath: string;

    private config: IConfiguration;

    constructor(
       private env: Environment
    ) {
        this.config = this.loadConfigFile();

        this.rootPath = path.join(__dirname, '../../', this.config.rootPath);
        this.server = {
            host: env.serverHost ? env.serverHost : this.config.server.host,
            port: env.serverPort ?  env.serverPort : this.config.server.port
        };
        this.p2p = {
            host: env.p2pHost ? env.p2pHost : this.config.p2p.host,
            port: env.p2pPort ? env.p2pPort : this.config.p2p.port,
            peers: env.p2pPeers ? env.p2pPeers.split(',') : []
        };
        this.creatorPublicKey = this.config.creatorPublicKey;
        this.storagePath = path.join(this.rootPath, this.config.storagePath);
    }

    private loadConfigFile(): IConfiguration {
        const configType: EnvType = (this.env.config ? this.env.config : 'local');
        const configName: string = `${configType}-config.json`;
        const configPath: string = path.join('../../config', configName);
        return require(configPath);
    }

}