import { Subscription } from 'rxjs';
import { HubConnection } from '@microsoft/signalr';
import { SignalRService } from '@ca-webstack/ng-signalr';

/**
 * Signalr JoinTaskDetailedGroup method name
 */
export const signalrJoinTaskKey = 'JoinTaskDetailedGroup';
/**
 * Signalr LeaveTaskDetailedGroup method name
 */
export const signalrLeaveTaskKey = 'LeaveTaskDetailedGroup';
/**
 * Shell signalr subscription
 */
export interface IShSignalrSubscription {
  /**
   * Subscription
   */
  subscription: Subscription;
  /**
   * Function to be called to close subscription
   */
  closeConnection: () => Promise<void>;
}

/**
 * Subscribes to a SignalR event by target path
 * @param target Target path (eventName or composition of hubName and eventName separated by slash)
 * @param callback Subscription callback
 * @param signalr Signalr service
 * @param defaultHubName Default Signalr Hub name
 * @param groupId Specifies group to join
 * @param join Specifies whether to join task detailed group
 */
export async function onSignalrEvent<TSignalrSubscription, TParams>(
  target: TSignalrSubscription,
  callback: (msg: TParams) => void,
  signalr: SignalRService,
  defaultHubName: string,
  groupId: string,
  join = false) {
  console.error('Deprecation error: "onSignalrEvent" method deprecated, use "SignalREvent" decorator or SignalRService instead');
  return null as any;
  // let hubName = defaultHubName;
  // let connection: HubConnection;
  // let eventName = <string><unknown>target;
  // const separator = '/';
  // if ((<string><unknown>target).indexOf(separator) > -1) {
  //   const info = (<string><unknown>target).split(separator);
  //   hubName = info[0];
  //   eventName = info[1];
  //   join = true;
  // }
  // if (!signalr) {
  //   throw new Error('SignalrService not injected');
  // }
  // if (join) {
  //   try {
  //     connection = await signalr.invoke(hubName, signalrJoinTaskKey, groupId);
  //     connection.onreconnected(async () => await signalr.invoke(hubName, signalrJoinTaskKey, groupId));
  //   } catch (ex) {
  //     console.error(ex);
  //   }
  // }
  // const subscription = signalr
  //   .on(hubName, eventName)
  //   .subscribe(<any>callback);
  // const closeConnection = connection && connection.stop;
  // return {
  //   subscription,
  //   closeConnection
  // } as IShSignalrSubscription;
}
