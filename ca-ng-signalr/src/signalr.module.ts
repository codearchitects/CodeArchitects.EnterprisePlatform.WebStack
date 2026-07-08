import { NgModule, ModuleWithProviders } from '@angular/core';
import { SignalRService } from './signalr.service';
import { HOST_URL } from './host-url.token';
import { CONNECTION_RETRY_COUNT } from './connection-retry-count.token';
import { SIGNALR_HTTP_CLIENT } from './http-client.token';
import { DISABLE_DATA_CONTEXT } from './disable-data-context.token';
import { DISABLE_SERIALIZATION } from './disable-serialization.token';
import { SIGNALR_ACCESS_TOKEN_FACTORY } from './access-token-factory.token';
import { HttpClient } from '@microsoft/signalr';

@NgModule({})
export class SignalRModule {
  static forRoot(hostUrl: string, connectionRetryCount = 3, httpClient?: HttpClient, disableSerialization = false, disableDataContext = false, accessTokenFactory?: () => string | Promise<string>): ModuleWithProviders<SignalRModule> {
    return {
      ngModule: SignalRModule,
      providers: [
        { provide: HOST_URL, useValue: hostUrl },
        { provide: CONNECTION_RETRY_COUNT, useValue: connectionRetryCount },
        { provide: SIGNALR_HTTP_CLIENT, useValue: httpClient },
        { provide: DISABLE_SERIALIZATION, useValue: disableSerialization },
        { provide: DISABLE_DATA_CONTEXT, useValue: disableDataContext },
        { provide: SIGNALR_ACCESS_TOKEN_FACTORY, useValue: accessTokenFactory },
        SignalRService
      ]
    };
  }
}
