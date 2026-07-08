import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { MetadataHelpers } from '@ca-webstack/reflection';
import { Mstring } from '@ca-webstack/ng-i18n';

import { IValidationParams, IWarningParams, ValidationKey, WarningKey } from '../decorators/index';

/**
 * Helper class that permits validation metadata extraction from an entity.
 *
 * ### Example
 * ```
 * import {ValidatorHelper} from 'cang2shell/services'
 *
 * class MyComponent {
 *   public constructor (
 *     private validatorHelper: ValidatorHelper
 *   ) { }
 *
 *   // use validatorHelper
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ValidatorHelper {

  /**
   * Extract validation metadata from an entity.
   *
   * @param model - Class or instance to extract validation metadata.
   * @param prop - Prop from which to extract validation metadata.
   * @return Validation metadata.
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
   *     message: 'First name is taken',
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
   *
   * let validation = validatorHelper.getValidation(Person);
   * // validation === [{ validator: ShellValidator.notEqual('firstName', 'lastName'), message: 'First name and last name cannot be equal' }]
   *
   * // - or -
   *
   * let person = new Person();
   * let validation = validatorHelper.getValidation(person);
   * // validation === [{ validator: ShellValidator.notEqual('firstName', 'lastName'), message: 'First name and last name cannot be equal' }]
   *
   * // - or -
   *
   * let validation = validatorHelper.getValidation(Person, 'firstName');
   * // validation === [{ validator: Validators.unique, message: 'First name is taken' }, { validator: Validators.maxLength(30), message: 'First name can\'t be longer than 30' }]
   *
   * // - or -
   *
   * let person = new Person();
   * let validation = validatorHelper.getValidation(person, 'firstName');
   * // validation === [{ validator: Validators.unique, message: 'First name is taken' }, { validator: Validators.maxLength(30), message: 'First name can\'t be longer than 30' }]
   * ```
   */
  public getValidation(model: any, prop?: string) {
    return MetadataHelpers.getMetadata<Array<IValidationParams>>(ValidationKey, model, prop, { inheritParentMetadata: true });
  }

  /**
   * Extract warning metadata from an entity.
   *
   * @param model - Class or instance to extract warning metadata.
   * @param prop - Prop from which to extract warning metadata.
   * @return Warning metadata.
   *
   * ### Example
   * ```
   * @Warning({
   *   validator: Validators.notEqual('firstName', 'lastName'),
   *   message: 'First name and last name cannot be equal'
   * })
   * class Person {
   *   private _firstName: string;
   *   private _lastName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
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
   *
   * let warning = validatorHelper.getWarning(Person);
   * // warning === [{ validator: ShellValidator.notEqual('firstName', 'lastName'), message: 'First name and last name cannot be equal' }]
   *
   * // - or -
   *
   * let person = new Person();
   * let warning = validatorHelper.getWarning(person);
   * // warning === [{ validator: ShellValidator.notEqual('firstName', 'lastName'), message: 'First name and last name cannot be equal' }]
   *
   * // - or -
   *
   * let warning = validatorHelper.getWarning(Person, 'firstName');
   * // warning === [{ validator: Validators.unique, message: 'First name is taken' }, { validator: Validators.maxLength(30), message: 'First name can\'t be longer than 30' }]
   *
   * // - or -
   *
   * let person = new Person();
   * let warning = validatorHelper.getWarning(person, 'firstName');
   * // warning === [{ validator: Validators.unique, message: 'First name is taken' }, { validator: Validators.maxLength(30), message: 'First name can\'t be longer than 30' }]
   * ```
   */
  public getWarning(model: any, prop?: string) {
    return MetadataHelpers.getMetadata<Array<IWarningParams>>(WarningKey, model, prop, { inheritParentMetadata: true });
  }

  /**
   * Construct a control from validation metadata.
   *
   * @param model - Class or instance to construct control.
   * @param prop - Prop from which to construct control.
   * @return Control for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let control = validatorHelper.getControl(Person, 'firstName');
   * // control === <FormControl> {value: '', validator: <ValidatorFn> [Validators.maxLength], asyncValidator: <AsyncValidatorFn> [Validators.unique] }
   *
   * // - or -
   *
   * let person = new Person();
   * let control = validatorHelper.getControl(person, 'firstName');
   * // control === <FormControl> {value: '', validator: <ValidatorFn> [Validators.maxLength], asyncValidator: <AsyncValidatorFn> [Validators.unique] }
   * ```
   */
  public getControl<T = any>(model: any, prop: string) {
    if (model) return new FormControl<T>(model[prop], this.getSyncValidators(model, prop), this.getAsyncValidators(model, prop));
  }

  /**
   * Construct a control group from validation metadata.
   *
   * @param model - Class or instance to construct control.
   * @return Control for property.
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
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   *
   *   public get lastName() { return this._lastName; }
   *   public set lastName(value: string) { this._lastName = value; }
   * }
   *
   * let group = validatorHelper.getGroup(Person);
   * // validation === <FormGruop> {{}, validator: <ValidatorFn> [Validators.notEqual], asyncValidator: [] }
   *
   * // - or -
   *
   * let group = validatorHelper.getGroup(Person);
   * // validation === <FormGruop> {{}, validator: <ValidatorFn> [Validators.notEqual], asyncValidator: [] }
   * ```
   */
  public getGroup<T extends {[K in keyof T]: AbstractControl<any>} = any>(model: any) {
    if (model) return new FormGroup<T>({} as T, this.getSyncValidators(model), this.getAsyncValidators(model));
  }

  /**
   * Extract synchronous validations from validation metadata.
   *
   * @param model - Class or instance to extract synchronous validations.
   * @param prop - Prop from which to extract synchronous validations.
   * @return Synchronous validations for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let syncValidators = validatorHelper.getSyncValidators(Person, 'firstName');
   * // syncValidators === <ValidatorFn> [Validators.maxLength]
   *
   * // - or -
   *
   * let person = new Person();
   * let syncValidators = validatorHelper.getSyncValidators(person, 'firstName');
   * // syncValidators === <ValidatorFn> [Validators.maxLength]
   * ```
   */
  public getSyncValidators(model: any, prop?: string): ValidatorFn;
  /**
   * Extract synchronous validations from validation metadata.
   *
   * @param model - Class or instance to extract synchronous validations.
   * @param prop - Prop from which to extract synchronous validations.
   * @param compose - If true, compose validators into a single function. Default is true.
   * @return Synchronous validations for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let syncValidators = validatorHelper.getSyncValidators(Person, 'firstName', false);
   * // syncValidators === [Validators.maxLength]
   *
   * // - or -
   *
   * let person = new Person();
   * let syncValidators = validatorHelper.getSyncValidators(person, 'firstName', false);
   * // syncValidators === [Validators.maxLength]
   * ```
   */
  public getSyncValidators(model: any, prop?: string, compose?: boolean): ValidatorFn[];
  public getSyncValidators(model: any, prop?: string, compose = true): ValidatorFn | ValidatorFn[] {
    if (compose) {
      return Validators.compose(this.getValidators<ValidatorFn>(model, prop, (item) => !item.async));
    } else {
      return this.getValidators<ValidatorFn>(model, prop, (item) => !item.async);
    }
  }

  /**
   * Extract asynchronous validations from validation metadata.
   *
   * @param model - Class or instance to extract asynchronous validations.
   * @param prop - Prop from which to extract asynchronous validations.
   * @return Asynchronous validations for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let asyncValidators = validatorHelper.getAsyncValidators(Person, 'firstName');
   * // asyncValidators === <AsyncValidatorFn> [Validators.unique]
   *
   * // - or -
   *
   * let person = new Person();
   * let asyncValidators = validatorHelper.getAsyncValidators(person, 'firstName');
   * // asyncValidators === <AsyncValidatorFn> [Validators.unique]
   * ```
   */
  public getAsyncValidators(model: any, prop?: string): AsyncValidatorFn;
  /**
   * Extract asynchronous validations from validation metadata.
   *
   * @param model - Class or instance to extract asynchronous validations.
   * @param prop - Prop from which to extract asynchronous validations.
   * @param compose - If true, compose validators into a single function. Default is true.
   * @return Asynchronous validations for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let asyncValidators = validatorHelper.getAsyncValidators(Person, 'firstName', false);
   * // asyncValidators === [Validators.unique]
   *
   * // - or -
   *
   * let person = new Person();
   * let asyncValidators = validatorHelper.getAsyncValidators(person, 'firstName', false);
   * // asyncValidators === [Validators.unique]
   * ```
   */
  public getAsyncValidators(model: any, prop?: string, compose?: boolean): AsyncValidatorFn[];
  public getAsyncValidators(model: any, prop?: string, compose = true): AsyncValidatorFn | AsyncValidatorFn[] {
    if (compose) {
      return Validators.composeAsync(this.getValidators<AsyncValidatorFn>(model, prop, (item) => item.async));
    } else {
      return this.getValidators<AsyncValidatorFn>(model, prop, (item) => item.async);
    }
  }

  /**
   * Extract synchronous warnings from warnings metadata.
   *
   * @param model - Class or instance to extract synchronous warnings.
   * @param prop - Prop from which to extract synchronous warnings.
   * @return Synchronous warnings for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let syncWarnings = validatorHelper.getSyncWarnings(Person, 'firstName');
   * // syncWarnings === <ValidatorFn> [Validators.maxLength]
   *
   * // - or -
   *
   * let person = new Person();
   * let syncWarnings = validatorHelper.getSyncWarnings(person, 'firstName');
   * // syncWarnings === <ValidatorFn> [Validators.maxLength]
   * ```
   */
  public getSyncWarnings(model: any, prop?: string): ValidatorFn;
  /**
   * Extract synchronous warnings from warnings metadata.
   *
   * @param model - Class or instance to extract synchronous warnings.
   * @param prop - Prop from which to extract synchronous warnings.
   * @param compose - If true, compose validators into a single function. Default is true.
   * @return Synchronous warnings for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let syncWarnings = validatorHelper.getSyncWarnings(Person, 'firstName', false);
   * // syncWarnings === [Validators.maxLength]
   *
   * // - or -
   *
   * let person = new Person();
   * let syncWarnings = validatorHelper.getSyncWarnings(person, 'firstName', false);
   * // syncWarnings === [Validators.maxLength]
   * ```
   */
  public getSyncWarnings(model: any, prop?: string, compose?: boolean): ValidatorFn[];
  public getSyncWarnings(model: any, prop?: string, compose = true): ValidatorFn | ValidatorFn[] {
    if (compose) {
      return Validators.compose(this.getWarnings<ValidatorFn>(model, prop, (item) => !item.async));
    } else {
      return this.getWarnings<ValidatorFn>(model, prop, (item) => !item.async);
    }
  }

  /**
   * Extract asynchronous warnings from warnings metadata.
   *
   * @param model - Class or instance to extract asynchronous warnings.
   * @param prop - Prop from which to extract asynchronous warnings.
   * @return Asynchronous warnings for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let asyncWarnings = validatorHelper.getAsyncWarnings(Person, 'firstName');
   * // asyncWarnings === <AsyncValidatorFn> [Validators.unique]
   *
   * // - or -
   *
   * let person = new Person();
   * let asyncWarnings = validatorHelper.getAsyncWarnings(person, 'firstName');
   * // asyncWarnings === <AsyncValidatorFn> [Validators.unique]
   * ```
   */
  public getAsyncWarnings(model: any, prop?: string): AsyncValidatorFn;
  /**
   * Extract asynchronous warnings from warnings metadata.
   *
   * @param model - Class or instance to extract asynchronous warnings.
   * @param prop - Prop from which to extract asynchronous warnings.
   * @param compose - If true, compose validators into a single function. Default is true.
   * @return Asynchronous warnings for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let asyncWarnings = validatorHelper.getAsyncWarnings(Person, 'firstName', false);
   * // asyncWarnings === [Validators.unique]
   *
   * // - or -
   *
   * let person = new Person();
   * let asyncWarnings = validatorHelper.getAsyncWarnings(person, 'firstName', false);
   * // asyncWarnings === [Validators.unique]
   * ```
   */
  public getAsyncWarnings(model: any, prop?: string, compose?: boolean): AsyncValidatorFn[];
  public getAsyncWarnings(model: any, prop?: string, compose = true): AsyncValidatorFn | AsyncValidatorFn[] {
    if (compose) {
      return Validators.composeAsync(this.getWarnings<AsyncValidatorFn>(model, prop, (item) => item.async));
    } else {
      return this.getWarnings<AsyncValidatorFn>(model, prop, (item) => item.async);
    }
  }

  /**
   * Extract validation message from validation metadata.
   *
   * @param control - Control that cause validation error.
   * @param error - Error name.
   * @param model - Class or instance to extract validation message.
   * @param prop - Prop from which to extract validation message.
   * @return Validation message for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Validation({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let message = validatorHelper.getMessage(myControl, 'unique', Person, 'firstName');
   * // message === 'First name is taken'
   *
   * // - or -
   *
   * let person = new Person();
   * let message = validatorHelper.getMessage(myControl, 'unique', person, 'firstName');
   * // message === 'First name is taken'
   * ```
   */
  public getMessage(control: AbstractControl, error: string | Mstring, model: any, prop?: string): string | Mstring {
    const meta = this.getValidation(model, prop) || [];
    return meta.reduce<string | Mstring>((memo, item) => item.validator(control) && item.validator(control)[this.isMstring(error) ? error.key : error] ? item.message : memo, undefined);
  }

  /**
   * Extract warning message from warning metadata.
   *
   * @param control - Control that cause warning error.
   * @param warning - Warning name.
   * @param model - Class or instance to extract warning message.
   * @param prop - Prop from which to extract warning message.
   * @return warning message for property.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Warning({
   *     validator: Validators.unique,
   *     message: 'First name is taken',
   *     async: true
   *   },{
   *     validator: Validators.maxLength(30),
   *     message: 'First name can\'t be longer than 30'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let message = validatorHelper.getWarningMessage(myControl, 'unique', Person, 'firstName');
   * // message === 'First name is taken'
   *
   * // - or -
   *
   * let person = new Person();
   * let message = validatorHelper.getWarningMessage(myControl, 'unique', person, 'firstName');
   * // message === 'First name is taken'
   * ```
   */
  public getWarningMessage(control: AbstractControl, warning: string | Mstring, model: any, prop?: string): string | Mstring {
    const meta = this.getWarning(model, prop) || [];
    return meta.reduce<string | Mstring>((memo, item) => item.validator(control) && item.validator(control)[this.isMstring(warning) ? warning.key : warning] ? item.message : memo, undefined);
  }

  private getValidators<T>(model: any, prop: string, filterFn: (param: IValidationParams) => boolean): T[] {
    const meta = this.getValidation(model, prop) || [];
    return meta
      .filter(filterFn)
      .map((item) => <T><any>item.validator);
  }

  private getWarnings<T>(model: any, prop: string, filterFn: (param: IWarningParams) => boolean): T[] {
    const meta = this.getWarning(model, prop) || [];
    return meta
      .filter(filterFn)
      .map((item) => <T><any>item.validator);
  }

  private isMstring(value: any): value is Mstring {
    return Boolean(value && value.key);
  }

}
