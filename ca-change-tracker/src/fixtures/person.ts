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
import * as _ from 'lodash';
import { Birthday } from './birthday';
import { Work } from './work';
import { Game } from './game';
import { Car } from './car';
import { City } from './city';
import { Animal } from './animal';

// entity
@JsonObject({
  name: 'MySolution.Model.Data.Person, MySolution.Model'
})
export class Person implements IObjectWithChangeTracker, INotifyPropertyChanged {
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

  @JsonIgnore() private _firstName: string;

  @Enumerable()
  public get firstName() { return this._firstName; }
  public set firstName(value: string) {
    if (this._firstName !== value) {
      this.changeTracker.recordOriginalValue('firstName', this._firstName);
      this._firstName = value;
      this.onPropertyChanged('firstName');
    }
  }
  // #endregion

  // #region Complex Properties
  @JsonIgnore() private _dateOfBirth: Birthday;

  @Enumerable()
  public get dateOfBirth() {
    if (!this._dateOfBirth) {
      this._dateOfBirth = new Birthday();
      const subscription = this._dateOfBirth.complexPropertyChanging.subscribe(this.handleDateOfBirthChanging.bind(this));
      this.subscriptions.set('dateOfBirth', subscription);
    }
    return this._dateOfBirth;
  }
  public set dateOfBirth(value: Birthday) {
    if (!_.isEqual(this._dateOfBirth, value)) {
      if (this.subscriptions.has('dateOfBirth')) {
        this.subscriptions.get('dateOfBirth')!.unsubscribe();
      }

      this.handleDateOfBirthChanging();
      this._dateOfBirth = value;
      this.onPropertyChanged('dateOfBirth');

      if (this._dateOfBirth) {
        const subscription = this._dateOfBirth.complexPropertyChanging.subscribe(this.handleDateOfBirthChanging.bind(this));
        this.subscriptions.set('dateOfBirth', subscription);
      }
    }
  }
  // #endregion

  // #region Navigation Properties
  @JsonIgnore() private _job: Work;

  public get job() { return this._job; }
  public set job(value: Work) {
    if (this._job !== value) {
      const previousValue = this._job;
      this._job = value;
      this.fixupJob(previousValue);
      this.onNavigationPropertyChanged('job');
    }
  }

  @JsonIgnore() private _hobbies: TrackableCollection<Game>;

  @JsonProperty({
    transformation: {
      name: 'hobbies',
      convertTo: (dic) => TrackableCollectionUtils.convertTcToArray(TrackableCollection, dic),
      convertFrom: (obj) => TrackableCollectionUtils.convertArrayToTc(TrackableCollection, obj)
    }
  })
  @Enumerable()
  public get hobbies() {
    if (!this._hobbies) {
      this._hobbies = TrackableCollectionFactory.getInstance<Game>();
      const subscription = this._hobbies.collectionChanged.subscribe(this.fixupHobbies.bind(this));
      this.subscriptions.set('hobbies', subscription);
    }
    return this._hobbies;
  }
  public set hobbies(value: Array<Game>) {
    if (this._hobbies !== value) {
      if (this.changeTracker.changeTrackingEnabled) {
        throw new Error('Cannot set the FixupChangeTrackingCollection when ChangeTracking is enabled');
      }
      if (this.subscriptions.has('hobbies')) {
        this.subscriptions.get('hobbies').unsubscribe();
      }
      this._hobbies = TrackableCollectionFactory.getInstance(...value);
      if (this._hobbies) {
        const subscription = this._hobbies.collectionChanged.subscribe(this.fixupHobbies.bind(this));
        this.subscriptions.set('hobbies', subscription);
      }
      this.onNavigationPropertyChanged('hobbies');
    }
  }

  @JsonIgnore() private _personalCar: Car;

  public get personalCar() { return this._personalCar; }
  public set personalCar(value: Car) {
    if (this._personalCar !== value) {
      var previousValue = this._personalCar;
      this._personalCar = value;
      this.fixupPersonalCar(previousValue);
      this.onNavigationPropertyChanged('personalCar');
    }
  }

  @JsonIgnore() private _cityOfBirth: City;

  public get cityOfBirth() { return this._cityOfBirth; }
  public set cityOfBirth(value: City) {
    if (this._cityOfBirth !== value) {
      var previousValue = this._cityOfBirth;
      this._cityOfBirth = value;
      this.fixupCityOfBirth(previousValue);
      this.onNavigationPropertyChanged('cityOfBirth');
    }
  }

  @JsonIgnore() private _pets: TrackableCollection<Animal>;

  @JsonProperty({
    transformation: {
      name: 'pets',
      convertTo: (dic) => TrackableCollectionUtils.convertTcToArray(TrackableCollection, dic),
      convertFrom: (obj) => TrackableCollectionUtils.convertArrayToTc(TrackableCollection, obj)
    }
  })
  @Enumerable()
  public get pets() {
    if (!this._pets) {
      this._pets = TrackableCollectionFactory.getInstance<Animal>();
      const subscription = this._pets.collectionChanged.subscribe(this.fixupPets.bind(this));
      this.subscriptions.set('pets', subscription);
    }
    return this._pets;
  }
  public set pets(value: Array<Animal>) {
    if (this._pets !== value) {
      if (this.changeTracker.changeTrackingEnabled) {
        throw new Error('Cannot set the FixupChangeTrackingCollection when ChangeTracking is enabled');
      }
      if (this.subscriptions.has('pets')) {
        this.subscriptions.get('pets').unsubscribe();
      }
      this._pets = TrackableCollectionFactory.getInstance(...value);
      if (this._pets) {
        const subscription = this._pets.collectionChanged.subscribe(this.fixupPets.bind(this));
        this.subscriptions.set('pets', subscription);
      }
      this.onNavigationPropertyChanged('pets');
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
    this.job = null;
    this.fixupJobKeys();
    this.hobbies.length = 0;
    this.personalCar = null;
    this.cityOfBirth = null;
    this.fixupCityOfBirthKeys();
    this.pets.length = 0;
  }

  // Records the original values for the complex property Complex
  private handleDateOfBirthChanging() {
    if (this.changeTracker.state !== ObjectState.added && this.changeTracker.state !== ObjectState.deleted) {
      this.changeTracker.state = ObjectState.modified;
    }
    Birthday.recordComplexOriginalValues('dateOfBirth', this.dateOfBirth, this.changeTracker);
  }
  // #endregion

  // #region Association Fixup
  private fixupJob(previousValue: Work) {

    if (previousValue && previousValue.persons.includes(this)) {
      const index = previousValue.persons.indexOf(this);
      previousValue.persons.splice(index, 1);
    }

    if (this.job) {
      if (!(this.job.persons.includes(this))) {
        this.job.persons.push(this);
      }
    }

    if (this.changeTracker.changeTrackingEnabled) {
      const originalValues = this.changeTracker.originalValues;
      if (originalValues.containsKey('job') && originalValues.get('job') === this.job) {
        originalValues.remove('job');
      } else {
        this.changeTracker.recordOriginalValue('job', previousValue);
      }

      if (this.job && !this.job.changeTracker.changeTrackingEnabled) {
        ObjectWithChangeTrackerExtensions.startTracking(this.job);
      }
    }
  }

  private fixupJobKeys() {
    const idKeyName = 'job.id';

    if (this.changeTracker.extendedProperties.containsKey(idKeyName)) {
      if (this.job === null || this.changeTracker.extendedProperties.get(idKeyName) === this.job.id) {
        this.changeTracker.recordOriginalValue(idKeyName, this.changeTracker.extendedProperties.get(idKeyName));
      }
      this.changeTracker.extendedProperties.remove(idKeyName);
    }
  }

  private fixupHobbies(e: NotifyCollectionChangedEventArgs<Game>) {
    if (e.newItems !== null) {
      e.newItems.forEach((item) => {
        if (!item.persons.includes(this)) {
          item.persons.push(this);
        }
        if (this.changeTracker.changeTrackingEnabled) {
          if (!item.changeTracker.changeTrackingEnabled) {
            ObjectWithChangeTrackerExtensions.startTracking(item);
          }
          this.changeTracker.recordAdditionToCollectionProperties('hobbies', item);
        }
      });
    }

    if (e.oldItems !== null) {
      e.oldItems.forEach((item) => {
        if (item.persons.includes(this)) {
          const index = item.persons.indexOf(this);
          item.persons.splice(index, 1);
        }
        if (this.changeTracker.changeTrackingEnabled) {
          this.changeTracker.recordRemovalFromCollectionProperties('hobbies', item);
        }
      });
    }
  }

  private fixupPersonalCar(previousValue: Car) {
    if (previousValue !== null && previousValue.person === this) {
      previousValue.person = null;
    }

    if (this.personalCar !== null) {
      this.personalCar.person = this;
    }

    if (this.changeTracker.changeTrackingEnabled) {
      if (this.changeTracker.originalValues.containsKey('personalCar') && this.changeTracker.originalValues.get('personalCar') === this.personalCar) {
        this.changeTracker.originalValues.remove('personalCar');
      } else {
        this.changeTracker.recordOriginalValue('personalCar', previousValue);
      }
      if (this.personalCar !== null && !this.personalCar.changeTracker.changeTrackingEnabled) {
        ObjectWithChangeTrackerExtensions.startTracking(this.personalCar);
      }
    }
  }

  private fixupCityOfBirth(previousValue: City) {
    if (this.changeTracker.changeTrackingEnabled) {
      if (this.changeTracker.originalValues.containsKey('cityOfBirth') && this.changeTracker.originalValues.get('cityOfBirth') === this.cityOfBirth) {
        this.changeTracker.originalValues.remove('cityOfBirth');
      } else {
        this.changeTracker.recordOriginalValue('cityOfBirth', previousValue);
      }
      if (this.cityOfBirth !== null && !this.cityOfBirth.changeTracker.changeTrackingEnabled) {
        ObjectWithChangeTrackerExtensions.startTracking(this.cityOfBirth);
      }
      this.fixupCityOfBirthKeys();
    }
  }

  private fixupCityOfBirthKeys() {
    const idKeyName = 'cityOfBirth.id';

    if (this.changeTracker.extendedProperties.containsKey(idKeyName)) {
      if (this.cityOfBirth === null || this.changeTracker.extendedProperties.get(idKeyName), this.cityOfBirth.id) {
        this.changeTracker.recordOriginalValue(idKeyName, this.changeTracker.extendedProperties.get(idKeyName));
      }
      this.changeTracker.extendedProperties.remove(idKeyName);
    }
  }

  private fixupPets(e: NotifyCollectionChangedEventArgs<Animal>) {
    if (e.newItems !== null) {
      e.newItems.forEach((item) => {
        if (this.changeTracker.changeTrackingEnabled) {
          if (!item.changeTracker.changeTrackingEnabled) {
            ObjectWithChangeTrackerExtensions.startTracking(item);
          }
          this.changeTracker.recordAdditionToCollectionProperties('pets', item);
        }
      });
    }

    if (e.oldItems !== null) {
      e.oldItems.forEach((item) => {
        if (this.changeTracker.changeTrackingEnabled) {
          this.changeTracker.recordRemovalFromCollectionProperties('pets', item);
        }
      });
    }
  }
  // #endregion
}

// entity extension
@JsonObject({
  name: 'MySolution.Model.Data.Child, MySolution.Model'
})
export class Child extends Person implements IObjectWithChangeTracker, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _age: string;

  public get age() { return this._age; }
  public set age(value: string) {
    if (this._age !== value) {
      this.changeTracker.recordOriginalValue('firstName', this._age);
      this._age = value;
      this.onPropertyChanged('age');
    }
  }
  // #endregion

  // #region ChangeTracking
  protected clearNavigationProperties() {
    super.clearNavigationProperties();
  }
  // #endregion
}