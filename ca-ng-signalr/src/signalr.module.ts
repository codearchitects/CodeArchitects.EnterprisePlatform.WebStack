import { NgModule, ModuleWithProviders } from '@angular/core';
import { SignalRService } from './signalr.service';
import { HOST_URL } from './host-url.token';
import { HUB_NAMES } from './hub-names.token';
import { CONNECTION_RETRY_COUNT } from './connection-retry-count.token';

@NgModule({})
export class SignalRModule {
  static forRoot(hostUrl: string, hubNames: Array<string>, connectionRetryCount = 3): ModuleWithProviders {
    return {
      ngModule: SignalRModule,
      providers: [
        { provide: HOST_URL, useValue: hostUrl },
        { provide: HUB_NAMES, useValue: hubNames },
        { provide: CONNECTION_RETRY_COUNT, useValue: connectionRetryCount },
        SignalRService
      ]
    };
  }
}
