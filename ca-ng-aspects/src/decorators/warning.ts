import { MetadataHelpers } from '@ca-webstack/reflection';
import { Mstring } from '@ca-webstack/ng-i18n';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

export const WarningKey = 'warning';

export interface IWarningParams {
  validator: ValidatorFn | AsyncValidatorFn;
  async?: boolean;
  message: string | Mstring;
}

/**
 * Decorator useful to describe warning rules of an entity prop.
 *
 * @type params - Warning rules.
 *
 * ### Example
 * ```
 * @Warning({
 *   validator: Validators.notEqual('firstName', 'lastName'),
 *   message: 'First name and last name shouldn't be equal'
 * })
 * class Person {
 *   private _firstName: string;
 *   private _lastName: string;
 *
 *   @Warning({
 *     validator: Validators.unique,
 *     message: 'First name is taken'
 *     async: true
 *   },{
 *     validator: Validators.maxLength(30),
 *     message: 'First name shouldn\'t be longer than 30'
 *   })
 *   public get firstName() { return this._firstName; }
 *   public set firstName(value: string) { this._firstName = value; }
 *
 *   public get lastName() { return this._lastName; }
 *   public set lastName(value: string) { this._lastName = value; }
 * }
 * ```
 */
export function Warning(...params: Array<IWarningParams>) {
  return MetadataHelpers.defineMetadata(WarningKey, params);
}
