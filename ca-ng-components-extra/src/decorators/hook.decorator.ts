import { ICaepHookHandler } from '../models';

export enum CaepHookType {
  Init,
  Change,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  AfterContentChecked,
  DoCheck,
  Destroy,
  OptionsChanges
}

/**
 * Description of CaepHook decorator params.
 */
export interface ICaepHookParams {
  /**
   * Type of lifecycle hook
   */
  type: CaepHookType;

  /**
   * Method priority compared to other method priorities of the same class
   */
  priority?: number;

  /**
   * If true runs method before superclass methods decorated for the same lifecycle hook;
   * @defalut false
   */
  runBeforeSuper?: boolean;
}

/**
 * Decorator useful to mark methods as specific hook handlers, so then it is not necessary to declare lifecycle hooks and call super() in subclasses of a class hierarchy.
 *
 *
 * @param params ICaepHookParams object for params specification. Max priority is 0.
 *
 * ### Example
 * ```
 * @CaepHook({ type: CaepHookType.Init, priority: 0 })
 * private setupTooltip() {
 * ```
 */
export function CaepHook(params: ICaepHookParams) {
  return (target: any, targetKey: string, descriptor: PropertyDescriptor) => {
    descriptor.enumerable = true;
    let hookHandler = <ICaepHookHandler>params;
    hookHandler.className = target.constructor.name;
    if (hookHandler.priority < 0) hookHandler.priority = undefined;
    Reflect.defineMetadata(CaepHookType[params.type], hookHandler, target, targetKey);
  };
}
