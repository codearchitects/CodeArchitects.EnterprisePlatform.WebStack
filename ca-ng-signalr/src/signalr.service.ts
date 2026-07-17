import * as $ from 'jquery';
(window as any)['jQuery'] = $;
import { Injectable, Inject } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { HOST_URL } from './host-url.token';
import { HUB_NAMES } from './hub-names.token';
import { take } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { CONNECTION_RETRY_COUNT } from './connection-retry-count.token';

/**
 * Represents a connection to a SignalR Hub.
 */
interface IShHubConnection extends HubConnection {
  /**
   * Handler invoked on connection re-estabilished
   */
  _reconnectedHandler: (connectionId?: string) => void;
}

/**
 * Helper class that permits to use SignalR features.
 *
 * ### Example
 * ```
 * import {SignalRService} from 'ca-ng-signalr'
 *
 * class MyChat {
 *   constructor (
 *     private signalR: SignalRService
 *   ) {
 *     signalR.subscribe('chatHub', 'messageSent', (chatMessage) => { // show chatMessage });
 *   }
 *
 *   sendMessage(chatMessage: string) {
 *     signalR.invoke('chatHub', 'sendMessage', chatMessage);
 *   }
 * }
 * ```
 */
@Injectable()
export class SignalRService {

  start$ = new Subject<void>();
  private proxies = new Map<string, HubConnection>();

  constructor(
    @Inject(HOST_URL) hostUrl: string,
    @Inject(HUB_NAMES) hubNames: Array<string>,
    @Inject(CONNECTION_RETRY_COUNT) private _retryCount: number
  ) {
    try {
      hubNames.forEach(hubName => {
        const connection = new HubConnectionBuilder()
          .withUrl(`${hostUrl}/${hubName}`)
          .configureLogging(LogLevel.Debug)
          .build() as IShHubConnection;
        connection.onreconnected = callback => connection._reconnectedHandler = callback;
        this.proxies.set(hubName, connection);
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Subscribe to a SignalR RPC
   *
   * @param hubName - name of the hub to subscribe
   * @param eventName - name of the event to subscribe
   *
   * ### Example
   * signalRService.on('chatHub', 'messageSent')
   *  .subscribe((chatMessage) => { // show chatMessage });
   */
  on<T>(hubName: string, eventName: string): Observable<T[]> {
    const proxy = this.getProxy(hubName);
    return Observable.create(async (observer: Observer<T>) => {
      await this.startConnection(proxy);
      const callback = (arg: T) => observer.next(arg);
      proxy.on(eventName, callback);
      return () => proxy.off(eventName, callback);
    });
  }

  /**
   * Invoke a SignalR RPC
   *
   * @param hubName - name of the hub of the method
   * @param methodName - name of the method to invoke
   * @param args - argument of the method to invoke
   * @return connection
   * 
   * ### Example
   * signalRService.invoke('chatHub', 'sendMessage', chatAuthor, chatMessage);
   */
  async invoke(hubName: string, methodName: string, ...args: Array<any>) {
    const proxy = this.getProxy(hubName);
    await this.startConnection(proxy);
    if (proxy.state === HubConnectionState.Connected) {
      proxy.invoke(methodName, ...args);
    } else {
      this.start$
        .pipe(take(1))
        .subscribe(() => proxy.invoke(methodName, ...args));
    }
    return proxy;
  }

  private getProxy(hubName: string) {
    if (!this.proxies.has(hubName)) {
      throw new Error(`Unable to find Hub: ${hubName}. Please, consider to register it on CA SignaR Module initialization.`);
    }
    return this.proxies.get(hubName);
  }

  private async startConnection(connection: HubConnection): Promise<any> {
    try {
      if (connection.state === HubConnectionState.Disconnected) {
        this.stateChanged(connection, HubConnectionState.Connecting);
        await connection.start();
        this.stateChanged(connection, HubConnectionState.Connected);
        connection.onclose(() => this.reconnect(connection as IShHubConnection));
        this.log('start connection done');
        this.start$.next();
      }
    } catch (error) {
      this.stateChanged(connection, HubConnectionState.Disconnected);
    }
  }

  private stateChanged(connection: HubConnection, state: HubConnectionState) {
    switch (state) {
      case HubConnectionState.Connected:
        this.log('state changed to connected');
        break;
      case HubConnectionState.Connecting:
        this.log('state changed to connecting');
        break;
      case HubConnectionState.Reconnecting:
        this.log('state changed to reconnecting');
        break;
      case HubConnectionState.Disconnected:
        this.log('state changed to disconnected');
        break;
    }
  }

  private reconnect(connection: IShHubConnection) {
    this.log('disconnected event raised');
    this.stateChanged(connection, HubConnectionState.Disconnected);
    let retryCount = this._retryCount;
    if (retryCount) {
      const interval = setInterval(() => {
        if (retryCount > 0) {
          this.stateChanged(connection, HubConnectionState.Reconnecting);
          this.log('try to reconnect');
          this.startConnection(connection)
            .then(() => {
              if (connection.state === HubConnectionState.Connected) {
                clearInterval(interval);
                connection._reconnectedHandler && connection._reconnectedHandler(connection.connectionId);
              } else {
                this.log('start connection failed; retrying in next 3 seconds');
              }
            })
          retryCount--;
        } else {
          clearInterval(interval);
          this.log('connection lost');
        }
      }, 3000);
    }
  }

  private log(message: string) {
    console.log(`== ca-signalr: ${message}`);
  }

}
