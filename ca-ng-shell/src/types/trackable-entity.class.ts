import { Serializer, JsonObject, JsonIgnore } from '@ca-webstack/reflection';
import { DataContext } from '@ca-webstack/data-context';
import {
  IObjectWithChangeTracker,
  ObjectChangeTracker,
  ObjectStateChangingEventArgs,
  ObjectState,
  ObjectWithChangeTrackerExtensions,
  NotifyCollectionChangedEventArgs
} from '@ca-webstack/change-tracker';
import { Entity } from './entity.class';

@JsonObject({ name: '' })
export abstract class TrackableEntity<TIdentifier = string>
  extends Entity<TIdentifier>
  implements IObjectWithChangeTracker {

  // #region ChangeTracking

  @JsonIgnore() protected _changeTracker: ObjectChangeTracker;

  /* tslint:disable */
  @JsonIgnore() private _rowVersion: Uint8Array;
  @JsonIgnore() private _isDraft: boolean;
  /* tslint:enable */

  public constructor() {
    super();
    this.changeTracker.changeTrackingEnabled = true;
  }

  public get rowVersion(): Uint8Array { return this.getProperty<Uint8Array>('rowVersion'); }
  public set rowVersion(value: Uint8Array) {
    const actual = this._rowVersion;
    let isChanged = (value === undefined) || (actual === undefined) || (value.length !== actual.length);
    if (!isChanged) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== actual[i]) {
          isChanged = true;
          break;
        }
      }
    }
    if (isChanged) {
      this.setProperty<Uint8Array>('rowVersion', value);
    }
  }

  public get isDraft(): boolean { return this.getProperty<boolean>('isDraft'); }
  public set isDraft(value: boolean) {
    this.setProperty<boolean>('isDraft', value);
  }

  protected onPropertyChanged(propertyName: string, oldValue: any, newValue: any) {
    if (this.changeTracker.state !== ObjectState.added && this.changeTracker.state !== ObjectState.deleted) {
      this.changeTracker.state = ObjectState.modified;
    }
    this.propertyChanged.next({ propertyName: propertyName });
    TrackableEntity.propertyChanged.next({ container: this, propertyName: propertyName, oldValue: oldValue, newValue: newValue });
  }

  public get changeTracker(): ObjectChangeTracker {
    if (!this._changeTracker) {
      this._changeTracker = new ObjectChangeTracker();
      const subscription = this._changeTracker.objectStateChanging.subscribe(this.handleObjectStateChanging.bind(this));
      this.subscriptions.set('changeTracker', <any>subscription);
    }
    return this._changeTracker;
  }
  public set changeTracker(value: ObjectChangeTracker) {
    if (this.subscriptions.has('changeTracker')) {
      this.subscriptions.get('changeTracker').unsubscribe();
    }
    this._changeTracker = value;
    if (this._changeTracker) {
      const subscription = this._changeTracker.objectStateChanging.subscribe(this.handleObjectStateChanging.bind(this));
      this.subscriptions.set('changeTracker', <any>subscription);
    }
  }

  protected handleObjectStateChanging(e: ObjectStateChangingEventArgs) {
    const self: any = this;
    if (e.newState === ObjectState.deleted && self['clearNavigationProperties'] instanceof Function) {
      self['clearNavigationProperties']();
    }
  }

  // #endregion

  // #region Facilities

  protected setProperty<T>(propName: string, value: T, isKey = false, attrName = this.getAttrName(propName)) {
    if ((this as any)[attrName] !== value) {
      if (!Serializer.isDeserializing && !DataContext.isAttaching && this.changeTracker.changeTrackingEnabled) {
        const oldValue = (this as any)[attrName];
        if (isKey) {
          if (this.changeTracker.changeTrackingEnabled && this.changeTracker.state !== ObjectState.added) {
            throw new Error('The property is part of the object\'s key and cannot be changed.');
          }
        } else {
          this.changeTracker.recordOriginalValue(propName, (this as any)[attrName]);
        }
        super.setProperty<T>(propName, value, isKey);
        this.onPropertyChanged(propName, oldValue, value);
      } else {
        super.setProperty<T>(propName, value, isKey);
      }
    }
  }

  protected setManyNavProperty<T>(
    propName: string,
    value: Array<T>,
    attrName = this.getAttrName(propName), fixupName = this.getFixupName(propName)
  ) {
    if ((this as any)[attrName] !== value) {
      if (!Serializer.isDeserializing && !DataContext.isAttaching && this.changeTracker.changeTrackingEnabled) {
        if ((this as any)[attrName]) {
          (this as any)[attrName].splice(0);
          (this as any)[attrName].push(...value);
        }
      } else {
        super.setManyNavProperty(propName, value);
      }
    }
  }

  protected oneToOneFixup<T>(fromProperty: string, toProperty: string, previousValue: T, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }
    super.oneToOneFixup(fromProperty, toProperty, previousValue, isBidirectional);

    if (this.changeTracker.changeTrackingEnabled) {
      if (
        this.changeTracker.originalValues.containsKey(toProperty) &&
        this.changeTracker.originalValues.get(toProperty) === (this as any)[toProperty]
      ) {
        this.changeTracker.originalValues.remove(toProperty);
      } else {
        this.changeTracker.recordOriginalValue(toProperty, previousValue);
      }
      if (this.isTrackable((this as any)[toProperty])) {
        if ((this as any)[toProperty] && !(this as any)[toProperty].changeTracker.changeTrackingEnabled) {
          ObjectWithChangeTrackerExtensions.startTracking((this as any)[toProperty]);
        }
      }
    }
  }

  protected oneToManyFixup<T>(fromProperty: string, toProperty: string, previousValue: T, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }
    super.oneToManyFixup(fromProperty, toProperty, previousValue, isBidirectional);

    if (this.changeTracker.changeTrackingEnabled) {
      const originalValues = this.changeTracker.originalValues;
      if (originalValues.containsKey(toProperty) && originalValues.get(toProperty) === (this as any)[toProperty]) {
        originalValues.remove(toProperty);
      } else {
        this.changeTracker.recordOriginalValue(toProperty, previousValue);
      }
      if (this.isTrackable((this as any)[toProperty])) {
        if ((this as any)[toProperty] && !(this as any)[toProperty].changeTracker.changeTrackingEnabled) {
          ObjectWithChangeTrackerExtensions.startTracking((this as any)[toProperty]);
        }
      }
    }
  }

  protected manyToOneFixup<T>(fromProperty: string, toProperty: string, e: NotifyCollectionChangedEventArgs<T>, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }

    if (e.newItems) {
      e.newItems.forEach((item: any) => {
        if (isBidirectional) {
          item[fromProperty] = this;
        }
        if (this.changeTracker.changeTrackingEnabled) {
          if (this.isTrackable(item)) {
            if (!item.changeTracker.changeTrackingEnabled) {
              ObjectWithChangeTrackerExtensions.startTracking(item);
            }
          }
          this.changeTracker.recordAdditionToCollectionProperties(toProperty, item);
        }
      });

      if (e.oldItems) {
        e.oldItems.forEach((item: any) => {
          if (isBidirectional) {
            if (item[fromProperty] === this) {
              item[fromProperty] = null;
            }
          }
          if (this.changeTracker.changeTrackingEnabled) {
            this.changeTracker.recordRemovalFromCollectionProperties(toProperty, item);
          }
        });
      }
    }
  }

  protected manyToManyFixup<T>(fromProperty: string, toProperty: string, e: NotifyCollectionChangedEventArgs<T>, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }

    if (e.newItems) {
      e.newItems.forEach((item: any) => {
        if (isBidirectional) {
          if (!item[fromProperty].includes(this)) {
            item[fromProperty].push(this);
          }
        }
        if (this.changeTracker.changeTrackingEnabled) {
          if (this.isTrackable(item)) {
            if (!item.changeTracker.changeTrackingEnabled) {
              ObjectWithChangeTrackerExtensions.startTracking(item);
            }
          }
          this.changeTracker.recordAdditionToCollectionProperties(toProperty, item);
        }
      });
    }

    if (e.oldItems) {
      e.oldItems.forEach((item: any) => {
        if (isBidirectional) {
          if (item[fromProperty].includes(this)) {
            const index = item[fromProperty].indexOf(this);
            item[fromProperty].splice(index, 1);
          }
        }
        if (this.changeTracker.changeTrackingEnabled) {
          this.changeTracker.recordRemovalFromCollectionProperties(toProperty, item);
        }
      });
    }
  }

  protected fixupKeys(toProperty: string) {
    const idKeyName = `${toProperty}.id`;
    if (this.changeTracker.extendedProperties.containsKey(idKeyName)) {
      if ((this as any)[toProperty] === null || this.changeTracker.extendedProperties.get(idKeyName) === (this as any)[toProperty].id) {
        this.changeTracker.recordOriginalValue(idKeyName, this.changeTracker.extendedProperties.get(idKeyName));
      }
      this.changeTracker.extendedProperties.remove(idKeyName);
    }
  }

  private isTrackable(value: any): value is IObjectWithChangeTracker {
    return Boolean(value && value.changeTracker);
  }

  // #endregion Facilities
}
