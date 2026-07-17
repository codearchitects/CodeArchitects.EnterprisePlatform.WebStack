import * as _ from 'lodash';

/**
 * @interface IMergeStrategy
 */
export interface IMergeStrategy {
  merge<T>(newVal: T, oldVal: T): T;
}

/**
 * @class OverwriteStrategy
 */
export class OverwriteStrategy {
  protected overwrite<T>(newVal: T, oldVal: T) {
    let newValKeys = _.keys(newVal);
    let oldValKeys = _.keys(oldVal);

    _.union(newValKeys, oldValKeys)
      .forEach((field) => {
        let isDateTime = Boolean(newVal[field] && newVal[field].toDate); //WORKAROUND DA ELIMINARE

        if (!_.isObject(newVal[field]) || _.isDate(newVal[field]) || isDateTime) {
          if (field.startsWith('_')) {
            const setterName = field.replace('_', '');
            const prop = Object.getOwnPropertyDescriptor(oldVal.constructor.prototype, setterName);
            if (prop) {
              if (Boolean(prop.set))
                oldVal[setterName] = newVal[setterName];
            } else {
              try {
                oldVal[setterName] = newVal[setterName];
              } catch (error) {
                error = error;
              }
            }
          } else {
            oldVal[field] = newVal[field];
          }
        }
      });
    return oldVal;
  }
}

/**
 * @enum MergeStrategy
 */
export enum MergeStrategy {
  IgnoreIfAttached = 0x1,
  OverwriteAlways = 0x2,
  OverwriteIfNotChanged = 0x4,
  Default = OverwriteAlways
}
