import { Subject, Subscription } from 'rxjs';
import { Enumerable, JsonObject, JsonIgnore, JsonProperty } from '@ca-webstack/reflection';
import {
  IObjectWithChangeTracker,
  INotifyPropertyChanged,
  ObjectChangeTracker,
  ObjectWithChangeTrackerExtensions,
  TrackableCollection,
  TrackableCollectionFactory,
  TrackableCollectionUtils,
  ObjectStateChangingEventArgs,
  PropertyChangedEventArgs,
  NotifyCollectionChangedEventArgs,
  ObjectState
} from '../index';
import { Person } from './person';

// n to n association
@JsonObject({
  name: 'MySolution.Model.Data.Game, MySolution.Model'
})
export class Game implements IObjectWithChangeTracker, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _id: string;

  @Enumerable()
  public get id() { return this._id; }
  public set id(value: string) {
    if (this._id !== value) {
      if (this.changeTracker.changeTrackingEnabled && this.changeTracker.state !== ObjectState.added) {
        throw new Error('The property \'Id\' is part of the object\'s key and cannot be changed.');
      }
      this._id = value;
      this.onPropertyChanged('id');
    }
  }
  // #endregion

  // #region Navigation Properties
  private _persons: TrackableCollection<Person>;

  @JsonProperty({
    transformation: {
      name: 'persons',
      convertTo: (dic) => TrackableCollectionUtils.convertTcToArray(TrackableCollection, dic),
      convertFrom: (obj) => TrackableCollectionUtils.convertArrayToTc(TrackableCollection, obj)
    }
  })
  @Enumerable()
  public get persons() {
    if (!this._persons) {
      this._persons = TrackableCollectionFactory.getInstance<Person>();
      const subscription = this._persons.collectionChanged.subscribe(this.fixupPersons.bind(this));
      this.subscriptions.set('persons', subscription);
    }
    return this._persons;
  }
  public set persons(value: Array<Person>) {
    if (this._persons !== value) {
      if (this.changeTracker.changeTrackingEnabled) {
        throw new Error('Cannot set the FixupChangeTrackingCollection when ChangeTracking is enabled');
      }
      if (this.subscriptions.has('persons')) {
        this.subscriptions.get('persons').unsubscribe();
      }
      this._persons = TrackableCollectionFactory.getInstance<Person>(...value);
      if (this._persons) {
        const subscription = this._persons.collectionChanged.subscribe(this.fixupPersons.bind(this));
        this.subscriptions.set('persons', subscription);
      }
      this.onNavigationPropertyChanged('persons');
    }
  }
  // #endregion

  // #region ChangeTracking
  @JsonIgnore() private _propertyChanged: Subject<PropertyChangedEventArgs>;
  @JsonIgnore() private _changeTracker: ObjectChangeTracker;
  @JsonIgnore() private _subscriptions: Map<string, Subscription>;

  protected onPropertyChanged(propertyName: string) {
    if (this.changeTracker.state !== ObjectState.added && this.changeTracker.state !== ObjectState.deleted) {
      this.changeTracker.state = ObjectState.modified;
    }
    this.propertyChanged.next({ propertyName: propertyName });
  }

  protected onNavigationPropertyChanged(propertyName: string) {
    this.propertyChanged.next({ propertyName: propertyName });
  }

  @JsonIgnore()
  public get propertyChanged() {
    if (!this._propertyChanged) {
      this._propertyChanged = new Subject<PropertyChangedEventArgs>();
    }
    return this._propertyChanged;
  }

  @Enumerable()
  public get changeTracker(): ObjectChangeTracker {
    if (!this._changeTracker) {
      this._changeTracker = new ObjectChangeTracker();
      const subscription = this._changeTracker.objectStateChanging.subscribe(this.handleObjectStateChanging.bind(this));
      this.subscriptions.set('changeTracker', subscription);
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
      this.subscriptions.set('changeTracker', subscription);
    }
  }

  @JsonIgnore()
  public get subscriptions() {
    if (!this._subscriptions) {
      this._subscriptions = new Map<string, Subscription>();
    }
    return this._subscriptions;
  }

  protected handleObjectStateChanging(e: ObjectStateChangingEventArgs) {
    if (e.newState === ObjectState.deleted) {
      this.clearNavigationProperties();
    }
  }

  protected clearNavigationProperties() {
    this.persons = null;
  }
  // #endregion

  // #region Association Fixup
  private fixupPersons(e: NotifyCollectionChangedEventArgs<Person>) {
    if (e.newItems !== null) {
      e.newItems.forEach((item) => {
        if (!item.hobbies.includes(this)) {
          item.hobbies.push(this);
        }
        if (this.changeTracker.changeTrackingEnabled) {
          if (!item.changeTracker.changeTrackingEnabled) {
            ObjectWithChangeTrackerExtensions.startTracking(item);
          }
          this.changeTracker.recordAdditionToCollectionProperties('persons', item);
        }
      });
    }

    if (e.oldItems !== null) {
      e.oldItems.forEach((item) => {
        if (item.hobbies.includes(this)) {
          const index = item.hobbies.indexOf(this);
          item.hobbies.splice(index, 1);
        }
        if (this.changeTracker.changeTrackingEnabled) {
          this.changeTracker.recordRemovalFromCollectionProperties('persons', item);
        }
      });
    }
  }
  // #endregion
}