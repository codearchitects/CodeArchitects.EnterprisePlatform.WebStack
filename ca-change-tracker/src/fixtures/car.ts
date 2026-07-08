import { Subject, Subscription } from 'rxjs';
import { JsonObject, JsonIgnore } from '@ca-webstack/reflection';
import {
  IObjectWithChangeTracker,
  INotifyPropertyChanged,
  ObjectChangeTracker,
  ObjectWithChangeTrackerExtensions,
  ObjectStateChangingEventArgs,
  PropertyChangedEventArgs,
  ObjectState
} from '../index';
import { Person } from './person';

// 1 to 1 association
@JsonObject({
  name: 'MySolution.Model.Data.Car, MySolution.Model'
})
export class Car implements IObjectWithChangeTracker, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _id: string;

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
  @JsonIgnore() private _person: Person;

  public get person() { return this._person; }
  public set person(value: Person) {
    if (this._person !== value) {
      var previousValue = this._person;
      this._person = value;
      this.fixupPerson(previousValue);
      this.onNavigationPropertyChanged('person');
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
    this.person = null;
  }
  // #endregion

  // #region Association Fixup
  private fixupPerson(previousValue: Person) {
    if (previousValue !== null && previousValue.personalCar === this) {
      previousValue.personalCar = null;
    }

    if (this.person !== null) {
      this.person.personalCar = this;
    }

    if (this.changeTracker.changeTrackingEnabled) {
      if (this.changeTracker.originalValues.containsKey('person') && this.changeTracker.originalValues.get('person') === this.person) {
        this.changeTracker.originalValues.remove('person');
      } else {
        this.changeTracker.recordOriginalValue('person', previousValue);
      }
      if (this.person !== null && !this.person.changeTracker.changeTrackingEnabled) {
        ObjectWithChangeTrackerExtensions.startTracking(this.person);
      }
    }
  }
  // #endregion
}