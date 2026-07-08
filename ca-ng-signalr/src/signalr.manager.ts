import { HubConnectionBuilder, LogLevel, HubConnection, HubConnectionState, HttpClient, JsonHubProtocol } from '@microsoft/signalr';
import { ISignalREvent } from './signalr.decorator';
import { SignalRLogger } from './signalr.logger';
import * as _ from 'lodash-es';
import { SerializerService } from '@ca-webstack/ng-serializer';
import { DataContextService } from '@ca-webstack/ng-data-context';
import { parseMessages } from './signalr.hub-protocol';
/**
 * SignalR Manager
 */
export class SignalRManager {
  /**
   * Serializer service
   */
  public static serializer: SerializerService;
  /**
   * DataContext service
   */
  public static dataContext: DataContextService;
  /**
   * Access Token factory
   */
  public static accessTokenFactory: () => string | Promise<string>;
  /**
   * List of signalr registered events
   */
  private static __events: ISignalREvent[] = [];
  /**
   * List of signalr hubs connections. Each connection is described by the connection object and a set of contexts that are using the connection.
   */
  private static __connections: { [hub: string]: { connection: HubConnection; contexts: Set<any> } } = {};
  /**
   * List of pending new signalr hubs connections. Each connection is described by the start promise and a set of contexts that are waiting for the connection to be estabilished.
   * This is used to support connections on hub in "disconnecting" state.
   */
  private static __pendingNewConnections: Map<string, { result: Promise<void>; contexts: Set<any> }> = new Map();
  /**
   * List of bound event handlers. Each handler is linked to a context, a hub name and a method name.
   */
  private static __boundEventHandlers: Map<any, Map<string, Map<string, Set<(...args: any[]) => any>>>> = new Map();
  /**
   * Host url
   */
  private static __hostUrl: string;
  /**
   * The number of times the browser will attempt to estabilish connection
   */
  private static __retryCount: number;
  /**
   * Custom http client
   */
  private static __httpClient: HttpClient;

  /**
   * Initializes manager
   * @param hostUrl Host url
   * @param retryCount The number of times the browser will attempt to estabilish connection
   * @param httpClient Custom http client
   */
  public static init(hostUrl: string, retryCount = 1, httpClient?: HttpClient, serializer?: SerializerService, dataContext?: DataContextService, accessTokenFactory?: () => string | Promise<string>) {
    SignalRManager.__hostUrl = hostUrl;
    SignalRManager.__retryCount = retryCount;
    SignalRManager.__httpClient = httpClient;
    SignalRManager.accessTokenFactory = accessTokenFactory;
    SignalRManager.serializer = serializer;
    SignalRManager.dataContext = dataContext;
    if (serializer) {
      JsonHubProtocol.prototype.parseMessages = parseMessages;
    }
  }

  /**
   * Registers a new event
   * @param event The event to register
   */
  public static register(event: ISignalREvent) {
    SignalRManager.__events.push(event);
  }

  /**
   * Unregisters an event
   * @param hubName Hub name
   * @param methodName Method name
   */
  public static unregister(hubName: string, methodName: string) {
    const index = SignalRManager.__events.findIndex(evt => evt.hubName === hubName && evt.methodName === methodName);
    if (index > -1) {
      SignalRManager.__events.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Estabilish connection with context involved hubs and
   * subscribes to decorated methods
   * @param context Context for which to estabilish connections
   */
  public static async connect<TContext = any>(context: TContext) {
    const events = SignalRManager
      .filter(t => t.target.constructor === context.constructor);
    for (const event of events) {
      try {
        let connection = SignalRManager.getConnection(event.hubName);
        switch (connection.state) {
          case HubConnectionState.Disconnecting:
            if (!SignalRManager.__pendingNewConnections.has(event.hubName)) {
              const result = new Promise<void>((resolve, reject) => {
                connection.onclose(() => {
                  if (SignalRManager.__pendingNewConnections.has(event.hubName)) {
                    setTimeout(async () => {
                      try {
                        connection = SignalRManager.getConnection(event.hubName, true);
                        await this.handleConnection(connection, event.hubName, context);
                        SignalRManager.__pendingNewConnections.delete(event.hubName);
                        resolve();
                      } catch(ex) {
                        SignalRManager.__pendingNewConnections.delete(event.hubName);
                        reject(ex);
                      }
                    });
                  } else {
                    reject(new Error(`Connection with ${event.hubName} closed`));
                  }
                });
              });
              SignalRManager.__pendingNewConnections.set(event.hubName, { result, contexts: new Set([context])});
              await result;
            } else {
              SignalRManager.__pendingNewConnections.get(event.hubName)!.contexts.add(context);
              await SignalRManager.__pendingNewConnections.get(event.hubName)!.result;
            }
            break;
          case HubConnectionState.Connected:
          case HubConnectionState.Reconnecting:
            SignalRManager.__connections[event.hubName].contexts.add(context);
            break;
          case HubConnectionState.Connecting:
          case HubConnectionState.Disconnected:
          default:
            await SignalRManager.handleConnection(connection, event.hubName, context);
            break;
        }
        const boundEventhandler = (args: any) => event.handler.call(context, args);
        if (!SignalRManager.__boundEventHandlers.has(context)) {
          SignalRManager.__boundEventHandlers.set(context, new Map());
        }
        if (!SignalRManager.__boundEventHandlers.get(context)!.has(event.hubName)) {
          SignalRManager.__boundEventHandlers.get(context)!.set(event.hubName, new Map());
        }
        if (!SignalRManager.__boundEventHandlers.get(context)!.get(event.hubName)!.has(event.methodName as string)) {
          SignalRManager.__boundEventHandlers.get(context)!.get(event.hubName)!.set(event.methodName as string, new Set());
        }
        SignalRManager.__boundEventHandlers.get(context)!.get(event.hubName)!.get(event.methodName as string)!.add(boundEventhandler);
        connection.on(<string>event.methodName, boundEventhandler);
      } catch (ex) {
        SignalRLogger.error(ex as any);
      }
    }
  }

  /**
   * Closes connection with context involved hubs and
   * unsubscribe from decorated methods
   * @param context Context for which to close connections
   */
  public static async disconnect<TContext = any>(context: TContext) {
    const hubs: { [hubName: string]: ISignalREvent[] } = _.groupBy(SignalRManager.filter(t => t.target.constructor === context.constructor), 'hubName') || {} as any;
    try {
      for (const hubName in hubs) {
        const connection = SignalRManager.__connections[hubName];
        SignalRManager.removeContextFromPendingNewConnections(context, hubName);
        SignalRManager.__boundEventHandlers.get(context)?.get(hubName)?.forEach((handlers, methodName) => {
          handlers.forEach(handler => {
              connection?.connection.off(methodName, handler);
          });
        });
        SignalRManager.__boundEventHandlers.get(context)?.delete(hubName);
        if (connection) {
          connection.contexts.delete(context);
          if (connection.contexts.size > 0) {
            continue;
          }
          SignalRLogger.warn(`Disconnecting from ${hubName}`);
          await connection.connection.stop();
          SignalRLogger.warn(`Disconnected from ${hubName}`);
          if (SignalRManager.__connections[hubName].connection === connection.connection) {
            delete SignalRManager.__connections[hubName];
          }
        }
      }
    } catch (error) {
      SignalRLogger.error(`Unable to disconnect all hubs from context. ${error}`);
    } finally {
      SignalRManager.__boundEventHandlers.delete(context);
      for (const hubName in hubs) {
        SignalRManager.removeContextFromPendingNewConnections(context, hubName);
        SignalRManager.__connections[hubName]?.contexts.delete(context);
      }
    }
  }

  /**
   * Filters out events that meet the condition specified in a callback function
   * @param callback Callback condition
   */
  public static filter(callback: (cmd: ISignalREvent) => boolean): ISignalREvent[] {
    return SignalRManager.__events.filter(callback) || [];
  }

  /**
   * Invokes a SignalR RPC
   * @param hubName Hub name
   * @param methodName Hub method name
   * @param params Hub method parameters
   */
  public static async invoke<THub = any, THubMethodParams = any>(hubName: string, methodName: keyof THub, params: THubMethodParams) {
    const connection = SignalRManager.getConnection(hubName);
    await SignalRManager.handleConnection(connection, hubName);
    try {
      await connection.invoke(<string>methodName, params);
    } catch (ex) {
      SignalRLogger.error(`Unable to invoke ${hubName} method ${String(methodName)}. ${ex}`);
    }
  }

  /**
   * Subscribes to an hub method
   * @param hubName Hub name
   * @param methodName Hub method name
   * @param callback Subscription callback
   */
  public static async subscribe<TParams = any>(hubName: string, methodName: string, callback: (args: TParams) => any) {
    const connection = this.getConnection(hubName);
    SignalRManager
      .handleConnection(connection, hubName)
      .then(() => connection.on(methodName, callback))
      .catch(ex => SignalRLogger.error(ex));
    return () => connection.off(methodName);
  }

  /**
   * Returns hub connection by hub name
   * @param hubName Hub name
   * @param forceNew If true, a new connection will be created. Default is false
   */
  private static getConnection(hubName: string, forceNew = false): HubConnection {
    let connection = SignalRManager.__connections[hubName]?.connection;
    if (!connection || forceNew) {
      if (SignalRManager.__httpClient || SignalRManager.accessTokenFactory) {
        connection = new HubConnectionBuilder()
          .withUrl(SignalRManager.__hostUrl + hubName, { httpClient: SignalRManager.__httpClient, accessTokenFactory: SignalRManager.accessTokenFactory })
          .configureLogging(LogLevel.Information)
          .build();
      } else {
        connection = new HubConnectionBuilder()
          .withUrl(SignalRManager.__hostUrl + hubName)
          .configureLogging(LogLevel.Information)
          .build();
      }
    }
    return connection;
  }

  /**
   * Handles hub connection
   * @param connection Hub connection
   * @param hubName Hub name
   * @param context Context to associate with the connection
   * @param retryCount The number of times the browser will attempt to estabilish connection
   */
  private static async handleConnection<TContext = any>(connection: HubConnection, hubName: string, context?: TContext, retryCount = SignalRManager.__retryCount): Promise<void> {
    try {
      if (connection.state === HubConnectionState.Disconnected) {
        SignalRLogger.warn(`Connecting to ${hubName}`);
        await connection.start();
        if (!SignalRManager.__connections[hubName]) {
          SignalRManager.__connections[hubName] = { connection, contexts: new Set() };
        } else {
          SignalRManager.__connections[hubName].connection = connection;
        }
        if (context) {
          SignalRManager.__connections[hubName].contexts.add(context);
        }
        SignalRLogger.log(`Connection with ${hubName} estabilished`);
      }
    } catch (error) {
      SignalRLogger.error(`Unable to estabilish connection with ${hubName}`);
      if (retryCount) {
        SignalRLogger.warn(`Trying again to reconnect to ${hubName} in 1s. Tentative ${SignalRManager.__retryCount - retryCount + 1} of ${SignalRManager.__retryCount}`);
        new Promise<void>((resolve, reject) => {
          setTimeout(async () => {
            try {
              await SignalRManager.handleConnection(connection, hubName, context, --retryCount);
              resolve();
            } catch (ex) {
              reject(ex);
            }
          }, 1000);
        });
      } else {
        SignalRLogger.error(`Connection to ${hubName} lost`);
      }
    }
  }

  /**
   * Removes context from pending new connections
   * @param context Context to remove
   * @param hubName Hub name
   */
  private static removeContextFromPendingNewConnections<TContext = any>(context: TContext, hubName: string) {
    const pending = SignalRManager.__pendingNewConnections.get(hubName);
    pending?.contexts.delete(context);
    if (pending?.contexts.size === 0) {
      SignalRManager.__pendingNewConnections.delete(hubName);
    }
  }

}
