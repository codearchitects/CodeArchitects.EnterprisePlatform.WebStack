import { BehaviorSubject } from "rxjs";
import { dictionary } from "./common.utility";

/**
 * Help refresh params
 */
export interface IHelpRefresh<T = any> {
  /**
   * Class instance
   */
  classInstance: T;
  /**
   * Property name
   */
  propertyName: string;
}

export class HelpManager {
  /**
   * Helpers
   */
  public static helpers: dictionary<dictionary<string>> = {};
  /**
   * Observable that specifies if helper is active
   */
  public static isHelperActive$ = new BehaviorSubject<boolean>(false);
  /**
   * GetHelp callback
   */
  private static _getHelpCallback: (helpId: string) => Promise<void> = undefined;
  /**
   * Subject that force the refresh of helpId
   */
  private static _refresh$ = new BehaviorSubject<IHelpRefresh>(undefined);
  /**
   * Subject that force the refresh of helpId
   */
  public static refresh$ = HelpManager._refresh$.asObservable();

  /**
   * Inits help manager
   */
  public static init(getHelpCallback: (helpId: string) => Promise<void>) {
    HelpManager._getHelpCallback = getHelpCallback;
  }

  /**
   * Registers an helpId
   */
  public static register<T>(componentInstance: T, propertyName: keyof T, helpId: string) {
    componentInstance && Reflect.defineMetadata('helpId', helpId, componentInstance.constructor, propertyName as string);
  }

  /**
   * Returns an helpId based on classInstance and propertyName
   */
  public static get<T>(classInstance: T, propertyName: string) {
    return classInstance && Reflect.getMetadata('helpId', classInstance.constructor, propertyName);
  }

  /**
   * Refreshes helpId
   */
  public static refresh<T>(classInstance: T, propertyName: string) {
    this._refresh$.next({ classInstance, propertyName });
  }

  /**
   * Unregisters an helpId
   */
  public static unregister<T>(classInstance: T, propertyName: string) {
    return classInstance && Reflect.deleteMetadata('helpId', classInstance.constructor, propertyName);
  }

  /**
   * Adds helpers
   */
  public static addHelpers(helperKey: string, helpers: dictionary<string>) {
    HelpManager.helpers[helperKey] = helpers;
  }

  /**
   * Returns helper based on key (helpers list) and name (helper)
   */
  public static getHelper(helperKey: string, helperName: string) {
    return HelpManager.helpers[helperKey] && HelpManager.helpers[helperKey][helperName];
  }

  /**
   * Executes getHelp callback
   */
  public static async getHelp(helpId: string) {
    HelpManager._getHelpCallback && await HelpManager._getHelpCallback(helpId);
  }
}