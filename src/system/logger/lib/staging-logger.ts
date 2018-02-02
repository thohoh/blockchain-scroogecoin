/* tslint:disable:no-console */

import { ILogger } from './logger.interface';
import { Component } from '@nestjs/common';

@Component()
export class StagingLogger implements ILogger {

    log(...args): void {
        this._log('log', ...args);
    }

    info(...args): void {
        this._log('info', ...args);
    }

    warn(...args): void {
        this._log('warn', ...args);
    }

    error(...args): void {
        this._log('error', ...args);
    }

    private _log(method, ...args) {
        console[method](...args);
    }
}