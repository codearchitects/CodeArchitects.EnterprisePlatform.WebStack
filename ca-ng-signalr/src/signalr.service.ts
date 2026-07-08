import { Injectable, Inject, Optional } from '@angular/core';
import { HOST_URL } from './host-url.token';
import { CONNECTION_RETRY_COUNT } from './connection-retry-count.token';
import { DISABLE_DATA_CONTEXT } from './disable-data-context.token';
import { DISABLE_SERIALIZATION } from './disable-serialization.token';
import { SignalRManager } from './signalr.manager';
import { SIGNALR_HTTP_CLIENT } from './http-client.token';
import { HttpClient } from '@microsoft/signalr';
import { SerializerService } from '@ca-webstack/ng-serializer';
import { DataContextService } from '@ca-webstack/ng-data-context';
import { SIGNALR_ACCESS_TOKEN_FACTORY } from './access-token-factory.token';

/**
 * SignalR service
 */
@Injectable()
export class SignalRService {
  /**
   * SignalR service
   * @param hostUrl Host url
   * @param retryCount The number of times the browser will attempt to estabilish connection
   */
  constructor(
    @Inject(HOST_URL) hostUrl: string,
    @Inject(CONNECTION_RETRY_COUNT) retryCount: number,
    @Optional() @Inject(SIGNALR_HTTP_CLIENT) httpClient?: HttpClient,
    @Optional() @Inject(DISABLE_SERIALIZATION) disableSerialization = false,
    @Optional() @Inject(DISABLE_DATA_CONTEXT) disableDataContext = false,
    @Optional() _serializer?: SerializerService,
    @Optional() _dataContext?: DataContextService,
    @Optional() @Inject(SIGNALR_ACCESS_TOKEN_FACTORY) accessTokenFactory = undefined,
  ) {
    if (disableSerialization) {
      _serializer = undefined;
      _dataContext = undefined;
    } else if (disableDataContext) {
      _dataContext = undefined;
    }
    SignalRManager.init(hostUrl, retryCount, httpClient, _serializer, _dataContext, accessTokenFactory);
  }

  /**
   * Estabilish connection with context involved hubs and
   * subscribes to decorated methods
   * @param context Context for which to estabilish connections
   */
  public async connect<TContext = any>(context: TContext) {
    await SignalRManager.connect(context);
  }

  /**
   * Closes connection with context involved hubs and
   * unsubscribe from decorated methods
   * @param context Context for which to close connections
   */
  public disconnect<TContext = any>(context: TContext) {
    SignalRManager.disconnect(context);
  }

  /**
   * Invokes a SignalR RPC
   * @param hubName Hub name
   * @param methodName Hub method name
   * @param params Hub method parameters
   */
  public async invoke<THub = any, THubMethodParams = any>(hubName: string, methodName: keyof THub, params: THubMethodParams) {
    await SignalRManager.invoke(hubName, <string>methodName, params);
  }

  /**
   * Subscribes to a hub method
   * @param hubName Hub name
   * @param methodName Hub method name
   * @param callback Subscription callback
   */
  public async subscribe<TParams = any>(hubName: string, methodName: string, callback: (args: TParams) => any) {
    return await SignalRManager.subscribe(hubName, methodName, callback);
  }

}
