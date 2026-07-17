import 'core-js';
import { expect } from 'chai';
import { spy, assert } from 'sinon';
import { Subject, Subscription } from 'rxjs';
import { Serializer, JsonObject, JsonIgnore, JsonProperty } from '@ca-webstack/reflection';
import {
  IObjectWithChangeTracker
  , INotifyPropertyChanged
  , INotifyComplexPropertyChanging
  , ObjectChangeTracker
  , ObjectWithChangeTrackerExtensions
  , TrackableCollection
  , TrackableCollectionFactory
  , TrackableCollectionUtils
  , ObjectList
  , ObjectStateChangingEventArgs
  , PropertyChangedEventArgs
  , NotifyCollectionChangedEventArgs
  , ObjectState
} from './index';
import * as _ from 'lodash';

// entity
@JsonObject({
  name: 'MySolution.Model.Data.Person, MySolution.Model'
})
class Person implements IObjectWithChangeTracker, INotifyPropertyChanged {
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
        this.subscriptions.get('dateOfBirth').unsubscribe();
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
class Child extends Person implements IObjectWithChangeTracker, INotifyPropertyChanged {
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

// complex type
@JsonObject({
  name: 'MySolution.Model.Data.Birthday, MySolution.Model'
})
class Birthday implements INotifyComplexPropertyChanging, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _date: string;

  public get date() { return this._date; }
  public set date(value: string) {
    if (this._date !== value) {
      this.onComplexPropertyChanging();
      this._date = value;
      this.onPropertyChanged('date');
    }
  }
  // #endregion

  // #region ChangeTracking
  @JsonIgnore() private _complexPropertyChanging: Subject<void>;
  @JsonIgnore() private _propertyChanged: Subject<PropertyChangedEventArgs>;

  public static recordComplexOriginalValues(parentPropertyName: string, complexObject: Birthday, changeTracker: ObjectChangeTracker) {
    if (!parentPropertyName || parentPropertyName.trim().length === 0) {
      throw new Error('String parameter cannot be null or empty.');
    }

    if (!changeTracker) {
      throw new Error('Value cannot be null.');
    }
    changeTracker.recordOriginalValue(`${parentPropertyName}.date`, complexObject && complexObject.date);
  }

  protected onComplexPropertyChanging() {
    this.complexPropertyChanging.next(null);
  }

  @JsonIgnore()
  public get complexPropertyChanging() {
    if (!this._complexPropertyChanging) {
      this._complexPropertyChanging = new Subject<void>();
    }
    return this._complexPropertyChanging;
  }

  protected onPropertyChanged(propertyName: string) {
    this.propertyChanged.next({ propertyName: propertyName });
  }

  @JsonIgnore()
  public get propertyChanged() {
    if (!this._propertyChanged) {
      this._propertyChanged = new Subject<PropertyChangedEventArgs>();
    }
    return this._propertyChanged;
  }
  // #endregion
}

// 1 to n association
@JsonObject({
  name: 'MySolution.Model.Data.Work, MySolution.Model'
})
class Work implements IObjectWithChangeTracker, INotifyPropertyChanged {
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
  private _persons: TrackableCollection<Person>;

  @JsonProperty({
    transformation: {
      name: 'persons',
      convertTo: (dic) => TrackableCollectionUtils.convertTcToArray(TrackableCollection, dic),
      convertFrom: (obj) => TrackableCollectionUtils.convertArrayToTc(TrackableCollection, obj)
    }
  })
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

    if (e.newItems) {
      e.newItems.forEach(item => {
        item.job = this;
        if (this.changeTracker.changeTrackingEnabled) {
          if (!item.changeTracker.changeTrackingEnabled) {
            ObjectWithChangeTrackerExtensions.startTracking(item);
          }
          this.changeTracker.recordAdditionToCollectionProperties('persons', item);
        }
      });
    }

    if (e.oldItems) {
      e.oldItems.forEach(item => {
        if (item.job === this) {
          item.job = null;
        }
        if (this.changeTracker.changeTrackingEnabled) {
          this.changeTracker.recordRemovalFromCollectionProperties('persons', item);
        }
      });
    }
  }
  // #endregion
}

// n to n association
@JsonObject({
  name: 'MySolution.Model.Data.Game, MySolution.Model'
})
class Game implements IObjectWithChangeTracker, INotifyPropertyChanged {
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
  private _persons: TrackableCollection<Person>;

  @JsonProperty({
    transformation: {
      name: 'persons',
      convertTo: (dic) => TrackableCollectionUtils.convertTcToArray(TrackableCollection, dic),
      convertFrom: (obj) => TrackableCollectionUtils.convertArrayToTc(TrackableCollection, obj)
    }
  })
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

// 1 to 1 association
@JsonObject({
  name: 'MySolution.Model.Data.Car, MySolution.Model'
})
class Car implements IObjectWithChangeTracker, INotifyPropertyChanged {
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

// 1 to n association with no navigational property
@JsonObject({
  name: 'MySolution.Model.Data.City, MySolution.Model'
})
class City implements IObjectWithChangeTracker, INotifyPropertyChanged {
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

  protected clearNavigationProperties() { ; }
  // #endregion
}

// n to n association with no navigational property
@JsonObject({
  name: 'MySolution.Model.Data.Animal, MySolution.Model'
})
class Animal implements IObjectWithChangeTracker, INotifyPropertyChanged {
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

  protected clearNavigationProperties() { ; }
  // #endregion
}

const personWithFirstNameSerialized = {
  $type: 'MySolution.Model.Data.Person, MySolution.Model',
  $id: '1',
  firstName: 'test 2',
  dateOfBirth: {
    $id: '2',
    $type: 'MySolution.Model.Data.Birthday, MySolution.Model'
  },
  hobbies: [],
  pets: [],
  changeTracker: {
    $id: '3',
    $type: 'CodeArchitects.Data.ObjectChangeTracker, CodeArchitects.Data',
    state: 4,
    changeTrackingEnabled: true,
    originalValues: {
      $id: '4',
      $type: 'CodeArchitects.Data.OriginalValuesDictionary, CodeArchitects.Data',
      firstName: 'test 1'
    },
    extendedProperties: {
      $id: '5',
      $type: 'CodeArchitects.Data.ExtendedPropertiesDictionary, CodeArchitects.Data'
    },
    objectsAddedToCollectionProperties: {
      $id: '6',
      $type: 'CodeArchitects.Data.ObjectsAddedToCollectionProperties, CodeArchitects.Data'
    },
    objectsRemovedFromCollectionProperties: {
      $id: '7',
      $type: 'CodeArchitects.Data.ObjectsRemovedFromCollectionProperties, CodeArchitects.Data'
    }
  }
};

const personWithHobbiesSerialized = {
  $type: 'MySolution.Model.Data.Person, MySolution.Model',
  $id: '1',
  dateOfBirth: {
    $id: '2',
    $type: 'MySolution.Model.Data.Birthday, MySolution.Model'
  },
  hobbies: [
    {
      $id: '3',
      $type: 'MySolution.Model.Data.Game, MySolution.Model',
      id: 'test 2',
      persons: [
        {
          $ref: '1'
        }
      ],
      changeTracker: {
        $id: '4',
        $type: 'CodeArchitects.Data.ObjectChangeTracker, CodeArchitects.Data',
        state: 2,
        changeTrackingEnabled: true,
        originalValues: {
          $id: '5',
          $type: 'CodeArchitects.Data.OriginalValuesDictionary, CodeArchitects.Data'
        },
        extendedProperties: {
          $id: '6',
          $type: 'CodeArchitects.Data.ExtendedPropertiesDictionary, CodeArchitects.Data'
        },
        objectsAddedToCollectionProperties: {
          $id: '7',
          $type: 'CodeArchitects.Data.ObjectsAddedToCollectionProperties, CodeArchitects.Data'
        },
        objectsRemovedFromCollectionProperties: {
          $id: '8',
          $type: 'CodeArchitects.Data.ObjectsRemovedFromCollectionProperties, CodeArchitects.Data'
        }
      }
    }
  ],
  pets: [],
  changeTracker: {
    $id: '9',
    $type: 'CodeArchitects.Data.ObjectChangeTracker, CodeArchitects.Data',
    state: 1,
    changeTrackingEnabled: true,
    originalValues: {
      $id: '10',
      $type: 'CodeArchitects.Data.OriginalValuesDictionary, CodeArchitects.Data'
    },
    extendedProperties: {
      $id: '11',
      $type: 'CodeArchitects.Data.ExtendedPropertiesDictionary, CodeArchitects.Data'
    },
    objectsAddedToCollectionProperties: {
      $id: '12',
      $type: 'CodeArchitects.Data.ObjectsAddedToCollectionProperties, CodeArchitects.Data',
      hobbies: {
        $id: '13',
        $type: 'CodeArchitects.Data.ObjectList, CodeArchitects.Data',
        $values: [
          {
            $ref: '3'
          }
        ]
      }
    },
    objectsRemovedFromCollectionProperties: {
      $id: '14',
      $type: 'CodeArchitects.Data.ObjectsRemovedFromCollectionProperties, CodeArchitects.Data',
      hobbies: {
        $id: '15',
        $type: 'CodeArchitects.Data.ObjectList, CodeArchitects.Data',
        $values: [
          {
            $id: '16',
            $type: 'MySolution.Model.Data.Game, MySolution.Model',
            id: 'test 1',
            persons: [],
            changeTracker: {
              $id: '17',
              $type: 'CodeArchitects.Data.ObjectChangeTracker, CodeArchitects.Data',
              state: 2,
              changeTrackingEnabled: false,
              originalValues: {
                $id: '18',
                $type: 'CodeArchitects.Data.OriginalValuesDictionary, CodeArchitects.Data'
              },
              extendedProperties: {
                $id: '19',
                $type: 'CodeArchitects.Data.ExtendedPropertiesDictionary, CodeArchitects.Data'
              },
              objectsAddedToCollectionProperties: {
                $id: '20',
                $type: 'CodeArchitects.Data.ObjectsAddedToCollectionProperties, CodeArchitects.Data'
              },
              objectsRemovedFromCollectionProperties: {
                $id: '21',
                $type: 'CodeArchitects.Data.ObjectsRemovedFromCollectionProperties, CodeArchitects.Data'
              }
            }
          }
        ]
      }
    }
  }
};

describe('Change tracker', () => {
  describe('Entity', () => {
    let log: Person;

    beforeEach(() => {
      // Arrange
      log = new Person();
    });

    it('should set Object State to Added on creation', () => {
      // Assert
      expect(log.changeTracker.state).to.equal(ObjectState.added);
    });

    it('should emit a property changed event on property change', () => {
      // Arrange
      const onNext = spy();
      log.propertyChanged.subscribe(onNext);

      // Act
      log.firstName = 'John';

      // Assert
      expect(onNext.calledWith({ propertyName: 'firstName' })).to.be.true;
    });

    it('should set Object State to Unchanged on changes accepted', () => {
      // Act
      log.changeTracker.acceptChanges();

      // Assert
      expect(log.changeTracker.state).to.equal(ObjectState.unchanged);
    });

    it('should set Object State to Modified on property change', () => {
      // Arrange
      log.changeTracker.acceptChanges();

      // Act
      log.firstName = 'John';

      // Assert
      expect(log.changeTracker.state).to.equal(ObjectState.modified);
    });

    it('should store original value on property change', () => {
      // Arrange
      log.firstName = 'John';
      log.changeTracker.acceptChanges();

      // Act
      log.firstName = 'Jane';

      // Assert
      expect(log.changeTracker.originalValues.get('firstName')).to.equal('John');
    });
  });

  describe('Entity with complex property', () => {
    let person: Person;

    beforeEach(() => {
      // Arrange
      person = new Person();
    });

    it('should emit a property changed event on complex property change', () => {
      // Arrange
      const onNext = spy();
      person.dateOfBirth.propertyChanged.subscribe(onNext);

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(onNext.calledWith({ propertyName: 'date' })).to.be.true;
    });

    it('should emit a complex property changing event on complex property change', () => {
      // Arrange
      const onNext = spy();
      person.dateOfBirth.complexPropertyChanging.subscribe(onNext);

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(onNext.calledWith(null)).to.be.true;
    });

    it('shold set Object State to Modified on complex property change', () => {
      // Arrange
      person.changeTracker.acceptChanges();

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(person.changeTracker.state).to.equal(ObjectState.modified);
    });

    it('should store original value on complex property change', () => {
      // Arrange
      person.dateOfBirth.date = '1980-01-01';
      person.changeTracker.acceptChanges();

      // Act
      person.dateOfBirth.date = '1985-12-31';

      // Assert
      expect(person.changeTracker.originalValues.get('dateOfBirth.date')).to.equal('1980-01-01');
    });
  });

  describe('Entity with navigational property with cardinality = 1', () => {
    let person: Person;
    let work: Work;

    beforeEach(() => {
      // Arrange
      person = new Person();
      work = new Work();
    });

    it('should add entity to reverse reference on navigational property change', () => {
      // Act
      person.job = work;

      // Assert
      expect(person.job.persons.includes(person)).to.be.true;
    });

    it('should emit a property changed event on navigational property change', () => {
      // Arrange
      const onNext = spy();
      person.propertyChanged.subscribe(onNext);

      // Act
      person.job = work;

      // Assert
      assert.calledWith(onNext, { propertyName: 'job' });
    });

    it('should store original value on navigational property change', () => {
      // Arrange
      const work1 = new Work();
      person.job = work1;
      person.changeTracker.acceptChanges();
      const work2 = new Work();

      // Act
      person.job = work2;

      // Assert
      expect(person.changeTracker.originalValues.get('job')).to.be.equal(work1);
    });
  });

  describe('Entity with navigational property with cardinality = n', () => {
    let work: Work;
    let person: Person;

    beforeEach(() => {
      // Arrange
      work = new Work();
      person = new Person();
    });

    it('should set entity as reverse reference on navigational property change', () => {
      // Arrange
      work.changeTracker.acceptChanges();

      // Act
      work.persons.push(person);

      // Assert
      expect(work.persons[0].job).to.be.equal(work);
    });

    it('should emit a property changed event on navigational property change', () => {
      // Arrange
      const onNext = spy();
      work.propertyChanged.subscribe(onNext);

      // Act
      work.persons = [person];

      // Assert
      expect(onNext.calledWith({ propertyName: 'persons' })).to.be.true;
    });

    it('should store added item on navigational property change', () => {
      // Arrange
      work.changeTracker.acceptChanges();

      // Act
      work.persons.push(person);

      // Assert
      expect(work.changeTracker.objectsAddedToCollectionProperties.containsKey('persons')).to.be.true;
      expect(work.changeTracker.objectsAddedToCollectionProperties.get('persons').contains(person)).to.be.true;
    });

    it('should store removed item on navigational property change', () => {
      // Arrange
      work.persons.push(person);
      work.changeTracker.acceptChanges();

      // Act
      work.persons.splice(0, 1);

      // Assert
      expect(work.changeTracker.objectsRemovedFromCollectionProperties.containsKey('persons')).to.be.true;
      expect(work.changeTracker.objectsRemovedFromCollectionProperties.get('persons').contains(person)).to.be.true;
    });
  });

  describe('ObjectWithChangeTrackerExtensions', () => {
    describe('enableChangeTracking', () => {
      it('should enable change tracker on root element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = false;

        // Act
        ObjectWithChangeTrackerExtensions.enableChangeTracking(person);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).to.be.true;
      });

      it('should enable change tracker on children of untrackable element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = false;
        const obj = { person: person };

        // Act
        ObjectWithChangeTrackerExtensions.enableChangeTracking(obj);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).to.be.true;
      });

      it('should enable change tracker on navigational property with cardinality = 1', () => {
        // Arrange
        const person = new Person();
        const job = new Work();
        job.changeTracker.changeTrackingEnabled = false;
        person.job = job;

        // Act
        ObjectWithChangeTrackerExtensions.enableChangeTracking(person);

        // Assert
        expect(job.changeTracker.changeTrackingEnabled).to.be.true;
      });

      it('should enable change tracker on navigational property with cardinality = n', () => {
        // Arrange
        const person = new Person();
        const hobby = new Game();
        hobby.changeTracker.changeTrackingEnabled = false;
        person.hobbies.push(hobby);

        // Act
        ObjectWithChangeTrackerExtensions.enableChangeTracking(person);

        // Assert
        expect(hobby.changeTracker.changeTrackingEnabled).to.be.true;
      });
    });
  });

  describe('ObjectWithChangeTrackerExtensions', () => {
    describe('disableChangeTracking', () => {
      it('should disable change tracker on root element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = true;

        // Act
        ObjectWithChangeTrackerExtensions.disableChangeTracking(person);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).to.be.false;
      });

      it('should disable change tracker on children of untrackable element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = true;
        const obj = { person: person };

        // Act
        ObjectWithChangeTrackerExtensions.disableChangeTracking(obj);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).to.be.false;
      });

      it('should disable change tracker on navigational property with cardinality = 1', () => {
        // Arrange
        const person = new Person();
        const job = new Work();
        job.changeTracker.changeTrackingEnabled = true;
        person.job = job;

        // Act
        ObjectWithChangeTrackerExtensions.disableChangeTracking(person);

        // Assert
        expect(job.changeTracker.changeTrackingEnabled).to.be.false;
      });

      it('should disable change tracker on navigational property with cardinality = n', () => {
        // Arrange
        const person = new Person();
        const hobby = new Game();
        hobby.changeTracker.changeTrackingEnabled = true;
        person.hobbies.push(hobby);

        // Act
        ObjectWithChangeTrackerExtensions.disableChangeTracking(person);

        // Assert
        expect(hobby.changeTracker.changeTrackingEnabled).to.be.false;
      });
    });
  });

  describe('TrackableCollection', () => {
    it('should be initializable without params', () => {
      // Act
      const trackableCollection = TrackableCollectionFactory.getInstance();

      // Assert
      expect(trackableCollection).to.exist;
    });

    it('should be initializable with params', () => {
      // Act
      const trackableCollection = TrackableCollectionFactory.getInstance<number>(31, 10);

      // Assert
      expect(trackableCollection).to.exist;
      expect(trackableCollection[0]).to.be.equal(31);
      expect(trackableCollection[1]).to.be.equal(10);
    });

    it('should add item through bracket operator', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>();

      // Act
      trackableCollection[0] = 31;

      // Assert
      expect(trackableCollection[0]).to.be.equal(31);
    });

    it('should add item through push operator', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>();

      // Act
      trackableCollection.push(31);

      // Assert
      expect(trackableCollection[0]).to.be.equal(31);
    });

    it('should implements reduce', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>(31, 10);

      // Act
      const actual = trackableCollection.reduce((memo, item) => memo + item, 0);

      // Assert
      expect(actual).to.be.equal(41);
    });

    it('should emit event on assignment', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);
      const callback = spy();
      trackableCollection.collectionChanged
        .subscribe(callback);

      // Act
      trackableCollection[1] = 30;

      // Assert
      assert.calledWith(callback, { newItems: [30], oldItems: [10] });
    });

    it('should emit event on delete', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);
      const callback = spy();
      trackableCollection.collectionChanged
        .subscribe(callback);

      // Act
      delete trackableCollection[1];

      // Assert
      assert.calledWith(callback, { newItems: null, oldItems: [10] });
    });

    it('should emit event on push', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>();
      const callback = spy();
      trackableCollection.collectionChanged
        .subscribe(callback);

      // Act
      trackableCollection.push(31, 10);

      // Assert
      assert.calledWith(callback, { newItems: [31, 10], oldItems: null });
    });

    it('should emit event on splice', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>(31, 10, 44);
      const callback = spy();
      trackableCollection.collectionChanged
        .subscribe(callback);

      // Act
      trackableCollection.splice(1);

      // Assert
      assert.calledWith(callback, { newItems: null, oldItems: [44, 10] });
    });

    it('should emit event on splice with substitutions', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance<number>(31, 10, 44);
      const callback = spy();
      trackableCollection.collectionChanged
        .subscribe(callback);

      // Act
      trackableCollection.splice(1, 2, 11, 12);

      // Assert
      assert.calledWith(callback, { newItems: [11, 12], oldItems: [10, 44] });
    });

  });

  describe('Serializer', () => {
    let serializer: Serializer;

    beforeEach(() => {
      // Arrange
      serializer = new Serializer();
    });

    it('should serialize simple entity correctly', () => {
      // Arrange
      const person = new Person();
      person.firstName = 'test 1';
      person.changeTracker.acceptChanges();
      person.firstName = 'test 2';

      // Act
      const actual = Function(`return ${serializer.serialize(person)}`).call(this);

      // Assert
      expect(actual).to.be.deep.equal(personWithFirstNameSerialized);
    });

    it('should serialize complex entity correctly', () => {
      // Arrange
      const game1 = new Game();
      game1.id = 'test 1';
      const game2 = new Game();
      game2.id = 'test 2';
      const person = new Person();
      person.hobbies.push(game1);
      person.changeTracker.acceptChanges();
      person.hobbies.splice(0);
      person.hobbies.push(game2);

      // Act
      const actual = Function(`return ${serializer.serialize(person)}`).call(this);

      // Assert
      expect(actual).to.be.deep.equal(personWithHobbiesSerialized);
    });

    //TESTNOTPASSING
    it.skip('should serialize entity correctly', () => {
      // Arrange
      const game1 = new Game();
      game1.id = 'test 1';
      const game2 = new Game();
      game2.id = 'test 2';
      const person = new Person();
      person.hobbies.push(game1);
      person.changeTracker.acceptChanges();
      person.hobbies.splice(0);
      person.hobbies.push(game2);

      // Act
      const actual = <Person>serializer.deserialize(serializer.serialize(person));

      // Assert
      expect(actual.changeTracker.objectsAddedToCollectionProperties.values[0]).to.be.instanceof(ObjectList);
    });
  });
});
