import { ShHubProxy } from "./hub.proxy";
import { SignalRManager } from "./signalr.manager";

/**
 * SignalR event arguments
 */
export interface ISignalREventArgs<THub extends typeof ShHubProxy = any> {
  /**
   * Hub reference
   */
  hub: THub;
  /**
   * Hub method name
   */
  methodName: keyof THub;
}

/**
 * SignalR event definition
 */
export interface ISignalREvent<THub extends typeof ShHubProxy = any, TTarget = any> extends Omit<ISignalREventArgs<THub>, 'hub'> {
  /**
   * Hub name
   */
  hubName: string;
  /**
   * Method handler
   */
  handler: Function;
  /**
   * Event target
   */
  target: TTarget;
}

/**
 * SignalR event decorator
 * @param params Event arguments
 */
export function SignalREvent<THub extends typeof ShHubProxy = any, TTarget = any>(params: ISignalREventArgs<THub>) {
  return (target: TTarget, targetKey: keyof TTarget) => {
    const { hub, methodName } = params;
    SignalRManager.register({
      hubName: hub.NAME,
      methodName,
      target,
      handler: target[targetKey] as unknown as Function
    });
  }
}
