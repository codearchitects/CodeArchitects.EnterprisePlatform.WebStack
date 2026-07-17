import * as _ from 'lodash';
import { IMergeStrategy, OverwriteAlwaysStrategy } from '../utils';
import { Context } from '../models';

export class DataContext {
  public static get isAttaching() { return DataContext.attaching; }

  private static attaching = false;

  private context = new Context();

  public attach<T>(root: T, mergeStrategy: IMergeStrategy = new OverwriteAlwaysStrategy()) {
    let checkList = new Array<any>();
    DataContext.attaching = true;
    let result = this.attachRecursive(root, mergeStrategy, checkList);
    DataContext.attaching = false;
    return result;
  }

  public detach<T>(value: T) {
    this.context.remove(value);
  }

  public clear() {
    this.context.clear();
  }

  private attachRecursive<T>(value: T, mergeStrategy: IMergeStrategy, checkList: Array<any>) {
    let attached = value;

    if (this.isAttachable(value)) {
      if (this.context.contains(value)) {
        attached = mergeStrategy.merge(value, this.context.get(value));
      } else {
        this.context.set(value);
      }
    }

    if (_.includes(checkList, attached)) {
      return attached;
    }

    checkList.push(attached);

    _.keysIn(value)
      .forEach((field) => {
        if (_.startsWith(field, '_')) return;
        let item = value[field];

        if (this.isExplorable(item)) {
          attached[field] = Array.isArray(item)
            ? item.map((arrayItem) => this.attachRecursive(arrayItem, mergeStrategy, checkList))
            : this.attachRecursive(item, mergeStrategy, checkList);
        }
      });

    return attached;
  }

  private isAttachable(value: any) {
    if (!_.isObject(value)
      || Array.isArray(value)
      || _.isFunction(value))
      return false;

    return this.context.hasEntityDecorator(value);
  }

  private isExplorable(value: any) {
    return this.isAttachable(value) || Array.isArray(value);
  }
}
