import { MetadataHelpers } from '@ca-webstack/reflection';
import { IShBaseValidationParams } from './utils';

export const ValidationKey = 'validation';

/**
 * Model for Validation decorator params
 */
export interface IValidationParams extends IShBaseValidationParams { }

/**
 * Decorator useful to describe validation rules of an entity or entity field.
 *
 * @type params - Validation rules.
 *
 * ### Example
 * ```
 * @Validation({
 *   validator: Validators.notEqual('firstName', 'lastName'),
 *   message: 'First name and last name cannot be equal'
 * })
 * class Person {
 *   private _firstName: string;
 *   private _lastName: string;
 *
 *   @Validation({
 *     validator: Validators.unique,
 *     message: 'First name is taken'
 *     async: true
 *   },{
 *     validator: Validators.maxLength(30),
 *     message: 'First name can\'t be longer than 30'
 *   })
 *   public get firstName() { return this._firstName; }
 *   public set firstName(value: string) { this._firstName = value; }
 *
 *   public get lastName() { return this._lastName; }
 *   public set lastName(value: string) { this._lastName = value; }
 * }
 * ```
 */
export function Validation(...params: Array<IValidationParams>) {
  return MetadataHelpers.defineMetadata(ValidationKey, params);
}
