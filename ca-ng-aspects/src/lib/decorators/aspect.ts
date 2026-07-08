import { MetadataHelpers } from '@ca-webstack/reflection';
import { Mstring } from '@ca-webstack/ng-i18n';

export const AspectKey = 'aspect';

export interface IAspectContext {
  label?: string | Mstring;
  template?: string;
  converters?: any | Array<any>;
}

export interface IAspectParams {
  default: IAspectContext;
  browse?: IAspectContext;
  edit?: IAspectContext;
}

/**
 * Decorator useful to describe aspect of an entity prop.
 * If added, aspect decorator must describe aspect of an entity prop in default context
 * and can describe aspect of an entity prop in browse and edit context.
 *
 * @type params - Aspect description.
 *
 * ### Example
 * ```
 * class Person {
 *   private _firstName: string;
 *
 *   @Aspect({
 *     default: {
 *       label: 'Name',
 *       template: 'sh-text'
 *     },
 *     browse: {
 *       converters: UpperCasePipe
 *     },
 *     edit: {
 *       label: 'First name'
 *     }
 *   })
 *   public get firstName() { return this._firstName; }
 *   public set firstName(value: string) { this._firstName = value; }
 * }
 * ```
 */
export function Aspect(params: IAspectParams) {
  return MetadataHelpers.defineMetadata(AspectKey, params);
}
