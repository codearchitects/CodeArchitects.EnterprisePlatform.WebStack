import { JsonObject, JsonIgnore } from '@ca-webstack/reflection';
import { EntityState } from '../types/entity-state.enum';
import { IPropertyChangedExtendedEventArgs } from './property-changed-extended-event-args.interface';
import { Serializer } from '@ca-webstack/reflection';
import { DataContext } from '@ca-webstack/data-context';
import {
  PropertyChangedEventArgs, INotifyPropertyChanged, NotifyCollectionChangedEventArgs, TrackableCollectionFactory
} from '@ca-webstack/change-tracker';
import { Subscription, Subject } from 'rxjs';

// @dynamic
@JsonObject({ name: '' })
export abstract class Entity<TIdentifier = string> implements INotifyPropertyChanged {

  public static _propertyChanged: Subject<IPropertyChangedExtendedEventArgs>;
  @JsonIgnore() public status: EntityState = 0;
  @JsonIgnore() protected _subscriptions: Map<string, Subscription>;
  @JsonIgnore() protected _propertyChanged: Subject<PropertyChangedEventArgs>;

  /* tslint:disable */
  @JsonIgnore() private _id: TIdentifier;
  /* tslint:enable */

  public get id(): TIdentifier { return this.getProperty<TIdentifier>('id'); }
  public set id(value: TIdentifier) { this.setProperty<TIdentifier>('id', value, true); }

  // #region Tracking utility

  @JsonIgnore()
  public get propertyChanged() {
    if (!this._propertyChanged) {
      this._propertyChanged = new Subject<PropertyChangedEventArgs>();
    }
    return this._propertyChanged;
  }

  @JsonIgnore()
  public static get propertyChanged() {
    if (!Entity._propertyChanged) {
      Entity._propertyChanged = new Subject<IPropertyChangedExtendedEventArgs>();
    }
    return Entity._propertyChanged;
  }

  @JsonIgnore()
  public get subscriptions() {
    if (!this._subscriptions) {
      this._subscriptions = new Map<string, Subscription>();
    }
    return this._subscriptions;
  }

  protected onPropertyChanged(propertyName: string, oldValue: any, newValue: any) {
    this.propertyChanged.next({ propertyName: propertyName });
    Entity.propertyChanged.next({ container: this, propertyName: propertyName, oldValue: oldValue, newValue: newValue });
  }

  protected onNavigationPropertyChanged(propertyName: string) {
    this.propertyChanged.next({ propertyName: propertyName });
  }

  // #endregion Tracking utility

  // #region Facilities

  protected getProperty<T>(propName: string, attrName = this.getAttrName(propName)): T {
    return (this as any)[attrName];
  }

  protected setProperty<T>(propName: string, value: T, isKey = false, attrName = this.getAttrName(propName)) {
    if ((this as any)[attrName] !== value) {
      (this as any)[attrName] = value;
    }
  }

  protected getOneNavProperty<T>(propName: string, attrName = this.getAttrName(propName)) {
    return (this as any)[attrName];
  }

  protected getManyNavProperty<T>(propName: string, attrName = this.getAttrName(propName), fixupName = this.getFixupName(propName)) {
    if (!(this as any)[attrName]) {
      (this as any)[attrName] = TrackableCollectionFactory.getInstance<T>();
      const subscription = (this as any)[attrName].collectionChanged.subscribe((this as any)[fixupName].bind(this));
      this.subscriptions.set(propName, subscription);
    }
    return (this as any)[attrName];
  }

  protected setOneNavProperty<T>(
    propName: string,
    value: T,
    attrName = this.getAttrName(propName), fixupName = this.getFixupName(propName)
  ) {
    if ((this as any)[attrName] !== value) {
      const previousValue = (this as any)[attrName];
      (this as any)[attrName] = value;
      (this as any)[fixupName](previousValue);
      this.onNavigationPropertyChanged(propName);
    }
  }

  protected setManyNavProperty<T>(
    propName: string,
    value: Array<T>,
    attrName = this.getAttrName(propName),
    fixupName = this.getFixupName(propName)
  ) {
    if ((this as any)[attrName] !== value) {
      if (this.subscriptions.has(propName)) {
        this.subscriptions.get(propName).unsubscribe();
      }
      if (value === undefined) {
        (this as any)[attrName] = TrackableCollectionFactory.getInstance<T>();
      } else {
        (this as any)[attrName] = TrackableCollectionFactory.getInstance<T>(...value);
      }
      if ((this as any)[attrName]) {
        const subscription = (this as any)[attrName].collectionChanged.subscribe((this as any)[fixupName].bind(this));
        this.subscriptions.set(propName, subscription);
      }
      this.onNavigationPropertyChanged(propName);
    }
  }

  protected oneToOneFixup<T>(fromProperty: string, toProperty: string, previousValue: T | any, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }

    if (isBidirectional) {
      if (previousValue && previousValue[fromProperty] === this) {
        previousValue[fromProperty] = null;
        if ((this as any)[toProperty]) {
          (this as any)[toProperty][fromProperty] = this;
        }
      }
    }
  }

  protected oneToManyFixup<T>(fromProperty: string, toProperty: string, previousValue: T | any, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }

    if (isBidirectional) {
      if (previousValue && previousValue[fromProperty].includes(this)) {
        const index = previousValue[fromProperty].indexOf(this);
        previousValue[fromProperty].splice(index, 1);
      }
      if ((this as any)[toProperty]) {
        if (!((this as any)[toProperty][fromProperty].includes(this))) {
          (this as any)[toProperty][fromProperty].push(this);
        }
      }
    }
  }

  protected manyToOneFixup<T>(fromProperty: string, toProperty: string, e: NotifyCollectionChangedEventArgs<T>, isBidirectional: boolean) {
    if (Serializer.isDeserializing || DataContext.isAttaching) {
      return;
    }

    if (isBidirectional) {
      if (e.newItems) {
        e.newItems.forEach((item: any) => {
          if (isBidirectional) {
            item[fromProperty] = this;
          }
        });
      }

      if (e.oldItems) {
        e.oldItems.forEach((item: any) => {
          if (isBidirectional) {
            if (item[fromProperty] === this) {
              item[fromProperty] = null;
            }
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
      });
    }
  }

  protected getAttrName(propName: string) {
    return `_${propName}`;
  }

  protected getFixupName(propName: string) {
    return `fixup${propName.charAt(0).toUpperCase()}${propName.slice(1)}`;
  }

  // #endregion Facilities

}
