import { IFormDesignerControlParams } from '../decorators/index';
import { ShBaseComponent } from './../components/base/base.component';

/**
 * Code Architects Component Class
 */
// tslint:disable-next-line: callable-types
export type ShComponentClass<TComponent extends ShBaseComponent<any> = any> = { new(): TComponent };

/**
 * Form Designer Control
 */
export interface IFormDesignerControl<T = any> extends IFormDesignerControlParams {
  /**
   * Control associated component class
   */
  component: ShComponentClass;
}

/**
 * Form Designer Manager
 */
export class FormDesignerManager {
  /**
   * Registered components
   */
  private static __components: Map<string, IFormDesignerControl> = new Map();

  private constructor() { }

  /**
   * Registers a new component
   * @param component the component to be registered
   * @param params the component configuration parameters
   */
  public static register(component: ShComponentClass, params: IFormDesignerControlParams) {
    FormDesignerManager.__components.set(params.name || component.name, { component, ...params });
  }

  /**
   * Unregisters a component
   * @param component the component to be unregistered
   */
  public static unregister(component: ShComponentClass): boolean;
  /**
   * Unregisters a component by name
   * @param component the name of the component to be unregistered
   */
  public static unregister(componentName: string): boolean;
  public static unregister(component: ShComponentClass | string) {
    const key = typeof component === 'string' ? component : component.constructor.name;
    if (FormDesignerManager.__components.has(key)) {
      FormDesignerManager.__components.delete(key);
      return true;
    }
  }

  /**
   * All Form Designer components
   */
  public static All() {
    return Array.from(FormDesignerManager.__components.keys());
  }

  /**
   * Clears all associated components
   */
  public static Clear() {
    FormDesignerManager.__components.clear();
  }

  /**
   * Retrieves a form designer component by key
   * @param key the component key
   */
  public static GetByKey(key: string) {
    return FormDesignerManager.__components.get(key);
  }

  /**
   * Returns the components that meet the condition specified in a callback function.
   * @param predicate filter method that calls the predicate function one time for each component.
   */
  public static Filter(predicate: (component: ShComponentClass) => boolean): ShComponentClass[];
  /**
   * Returns the components that meet the name.
   * @param componentName the name for which to filter the components.
   */
  public static Filter(componentName: string): ShComponentClass;
  public static Filter(callbackOrComponentName: string | ((component: ShComponentClass) => boolean)): ShComponentClass[] | ShComponentClass {
    if (typeof callbackOrComponentName === 'string') {
      const retval = FormDesignerManager.__components.get(callbackOrComponentName);
      return retval && retval.component;
    } else {
      const retval = [];
      for (const key of (FormDesignerManager.__components as any).keys()) {
        const component = FormDesignerManager.__components.get(key).component;
        if (callbackOrComponentName(component)) {
          retval.push(component);
        }
      }
      return retval;
    }
  }
}
