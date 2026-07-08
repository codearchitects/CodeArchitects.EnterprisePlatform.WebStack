import { Injector } from "@angular/core";
import { SignalRService } from "./signalr.service";

/**
 * SignalR Hub proxy
 */
export abstract class ShHubProxy {
  /**
   * Hub name
   */
  public static readonly NAME: string;
  /**
   * Hub name
   */
  public abstract hubName: string;
  /**
   * SignalR service
   */
  protected signalrService: SignalRService;

  constructor(injector: Injector) {
    this.signalrService = injector.get(SignalRService);
  }

  /**
   * Joins a group by identifier
   * @param groupId Group identifier
   */
  public joinGroup(groupId: string) {
    return this.createHubMethod('JoinGroup').invoke({ groupId });
  }

  /**
   * Leaves a group by identifier
   * @param groupId Group identifier
   */
  public leaveGroup(groupId: string) {
    return this.createHubMethod('LeaveGroup').invoke({ groupId });
  }

  /**
   * Returns hub method (invokable, subscribable and unsubscribable)
   * @param methodName Method name
   */
  protected createHubMethod<TParams = any>(methodName: string) {
    let unsubscribe: Function;
    return {
      invoke: async (params: TParams) => await this.signalrService.invoke(this.hubName, methodName, params),
      subscribe: async (callback: (params: TParams) => any) => {
        this.signalrService.subscribe(this.hubName, methodName, callback).then(off => {
          unsubscribe = off;
        });
        return { unsubscribe: () => unsubscribe() };
      },
      unsubscribe: () => unsubscribe()
    }
  }
}
