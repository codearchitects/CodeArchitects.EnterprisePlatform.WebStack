import { each } from 'lodash-es';
import { Mstring } from '@ca-webstack/ng-i18n';
import { Aspect, IValidationParams, Validation } from '@ca-webstack/ng-aspects';
import { Command, ShCommandComponent, ICommand } from '@ca-webstack/ng-command-dispatcher';

/**
 * Default icon name for the sidebar toggler
 */
export const CAEP_SIDEBAR_DEFAULT_TOGGLER_ICON = 'icon icon-hamburger';

/**
 * Default icon name for the sidebar search
 */
export const CAEP_SIDEBAR_SEARCH_DEFAULT_ICON = 'icon icon-search';

/**
 * Property name used with FormattedControlValueAccessorDirective to bind model value of a formatted input component
 */
export const FORMATTED_CVA_MODEL_PROPERTY_NAME = 'value';

/**
 * Checks whether the item is at least equal to one of the values
 * @param {T} item The item for which execute control
 * @param {T[]} values The values to check
 */
export function IN<T>(item: T, ...values: T[]) {
  let retval = false;
  each(values, value => {
    if (item === value) {
      retval = true;
      return false;
    }
    return true;
  });
  return retval;
}

/**
 * Checks whether the item is at least equal to one of the values
 * and returns the matched value
 * @param {T} item The item for which execute control
 * @param {T[]} values The values to check
 */
export function INOUT<T>(item: T, ...values: T[]) {
  let retval: T;
  each(values, value => {
    if (item === value) {
      retval = value;
      return false;
    }
    return true;
  });
  return retval;
}

/**
 * Retrieves an empty guid
 */
export function getGuidEmpty() {
  return '00000000-0000-0000-0000-000000000000';
}

/**
 * Represents a dictionary
 */
export type dictionary<T> = { [key: string]: T };

/**
 * Executes a function with yield
 * @param callback The function to be executed after yield
 */
export function yieldFunc(callback: (...args: any[]) => any) {
  setTimeout(callback);
}

/**
 * Awaitable setTimeout
 */
export function setTimeoutAsync(handler: () => void, timeout?: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      try {
        handler();
        resolve();
      } catch (ex) {
        reject(ex);
      }
    }, timeout);
  });
}

/**
 * Checks if a value is null
 * @param target The value
 */
export function isNull<T>(target: T) {
  return target === null;
}

/**
 * Checks if a value is undefined
 * @param target The value
 */
export function isUndefined<T>(target: T) {
  return target === undefined;
}

/**
 * Checks if a value is null or undefined
 * @param target The value
 */
export function isNoU<T>(target: T) {
  return isUndefined(target) || isNull(target);
}

/**
 * Checks if values are null or undefined
 * @param targets
 */
export function areNoU<T>(...targets: T[]) {
  let retval = false;
  each(targets, t => {
    retval = isNoU(t);
    return !retval;
  });
  return retval;
}

/**
 * Utility used to return only distinct (different) values
 * @param items items to differentiate
 */
export function distinct<T>(...items: T[]) {
  return Array.from(new Set([...items]));
}

/**
 * Checks if date is valid
 * @param date The date for which performs check
 */
export function isDateValid(date: Date) {
  let isValid = true;
  if (date && isNaN(date.valueOf())) {
    isValid = false;
  }
  return isValid;
}

/**
 * Checks if a value is defined and not empty
 * @param value
 */
export function isPresent(value: any) {
  return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
}

/**
 * Decorates property with aspects
 */
export function addAspects<T>(model: Object, propertyName: string, label: string | Mstring, template: string) {
  const decorator = Aspect({
    default: {
      label: label,
      template: template
    }
  });
  decorator(model, propertyName);
}

/**
 * Decorates property with validators
 */
export function addValidators<T>(model: Object, propertyName: string, ...validators: IValidationParams[]) {
  const decorator = Validation(...validators);
  decorator(model, propertyName);
}

/**
 * Decorates component with commands
 * @param component Component to be decorated
 * @param commands List of commands
 */
export function addCommands(component: ShCommandComponent, ...commands: ICommand[]) {
  commands.forEach(command => {
    const decorator = Command({
      name: command.name,
      label: command.label,
      caption: command.caption,
      iconClassName: command.iconClassName,
      htmlClassName: command.htmlClassName,
      visible: command.visible,
      enabled: command.enabled,
      resource: command.resource,
      family: command.family
    });
    const handlerIdentifier = command.name.replace(new RegExp('-', 'g'), '');
    (component as any)[handlerIdentifier] = command.handler.bind(command);
    decorator(component, handlerIdentifier);
  });
}

/**
 * Inserts item into collecton at specific index
 * @param collection Collection
 * @param item Item to be inserted
 * @param index Index
 */
export function insertAtIndex<T>(collection: T[], item: T, index: number) {
  collection.splice(index, 0, item);
}
