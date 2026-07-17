import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import * as _ from 'lodash';
import { TrackableCollection } from './trackable-collection';

export class TrackableCollectionFactory {
  private static sideEffectCommands = ['push', 'splice'];

  static getInstance<T>(...items: Array<T>): TrackableCollection<T> {
    const tc = Object.setPrototypeOf(items, TrackableCollection.prototype);
    return new Proxy(tc, {
      get: (target, property, receiver) => {
        if (TrackableCollectionFactory.sideEffectCommands.includes(<string>property)) {
          target['$$command'] = property;
        }
        return target[property];
      },
      set: (target, property, value, receiver) => {
        if (!isNaN(<number>property)) {
          TrackableCollectionFactory.addToTarget(target, '$$newItems', value);
          TrackableCollectionFactory.addToTarget(target, '$$oldItems', target[property]);
        }
        target[property] = value;
        TrackableCollectionFactory.commit(tc, target, property);
        return true;
      },
      deleteProperty: (target, property) => {
        if (!isNaN(<number>property)) {
          TrackableCollectionFactory.addToTarget(target, '$$oldItems', target[property]);
        }
        TrackableCollectionFactory.commit(tc, target, property);
        return true;
      }
    });
  }

  private static addToTarget(target, property, value) {
    if (!target[property]) {
      target[property] = [];
    }
    if (value) {
      target[property].push(value);
    }
  }

  private static getItems(target, property) {
    const other = property === '$$newItems' ? '$$oldItems' : '$$newItems';
    const result = _.difference(target[property] || [], target[other] || []);
    return result.length > 0 ? result : null;
  }

  private static commit(tc, target, property) {
    if (!tc.collectionChanged) {
      tc = Object.setPrototypeOf(tc, TrackableCollection.prototype);
    }
    if (
      (target['$$command'] && property === 'length')
      || (!target['$$command'] && !isNaN(<number>property))
    ) {
      tc.collectionChanged
        .next({
          newItems: TrackableCollectionFactory.getItems(target, '$$newItems'),
          oldItems: TrackableCollectionFactory.getItems(target, '$$oldItems')
        });
      delete target['$$newItems'];
      delete target['$$oldItems'];
      delete target['$$target'];
    }
  }

}
