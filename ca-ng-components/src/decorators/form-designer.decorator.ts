import { Mstring } from '@ca-webstack/ng-i18n';
import { FormDesignerManager } from '../services/index';

/**
 * Form Designer Control Options Configuration
 */
export interface IFormDesignerControlOption<TType = 'string' | 'boolean' | 'number', TValue = any> {
  /**
   * Control option name
   */
  name: string;
  /**
   * Control option type
   */
  type: TType;
  /**
   * Specifies whether control option is disabled
   */
  disabled?: boolean;
  /**
   * Specifies whether control option is hidden
   */
  hidden?: boolean;
  /**
   * Control option default value
   */
  value?: TValue;
}

/**
 * Form Designer Control Parameters
 */
export interface IFormDesignerControlParams {
  /**
   * Control name
   */
  name?: string;
  /**
   * Control short description
   */
  shortDescription?: string | Mstring;
  /**
   * Control long description
   */
  longDescription?: string | Mstring;
  /**
   * Control options configurations
   */
  options?: IFormDesignerControlOption[];
}

/**
 * Decorator useful to allowing the use of a component with the form-designer
 *
 * @type params - Form Designer Control informations.
 *
 * ### Example
 * ```
 * @FormDesignerControl({
 *   shortDescription: 'Select',
 *   longDescription: 'Select component'
 * })
 * export class AppSelectComponent<T,V> extends ShSelectComponent<T,V> {
 *
 * }
 * ```
 */
export function FormDesignerControl(params: IFormDesignerControlParams = {}) {
  return (target: any) => {
    const options: IFormDesignerControlOption[] = [{
      name: 'width',
      type: 'string'
    }];
    params.options = [...options, ...(params.options || [])];
    FormDesignerManager.register(target, params);
    return target;
  };
}
