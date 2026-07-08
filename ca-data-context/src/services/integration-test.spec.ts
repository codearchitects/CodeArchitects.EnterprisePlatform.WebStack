import { IObjectWithChangeTracker, ObjectState } from '@ca-webstack/change-tracker';
import { IgnoreIfExistsStrategy, OverwriteAlwaysStrategy, OverwriteIfNotChangedStrategy } from '../utils/strategies';
import { IMergeStrategy } from '../utils/merge-strategy';
import { DataContext } from '../services/data-context';
import { Major, Person, BasketTeam } from './fixtures/models';
import { TrackedPerson } from '../utils/fixtures/models';
import { City } from './fixtures/models.2';

// Integration tests
describe('Integration tests - IgnoreIfExistsStrategy', () => {

  let mergeStrategy: IgnoreIfExistsStrategy, dataContext: DataContext;

  beforeEach(() => {
    mergeStrategy = new IgnoreIfExistsStrategy();
    dataContext = new DataContext();
  });

  it('should be defined', () => {
    expect(IgnoreIfExistsStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof IgnoreIfExistsStrategy).toBeTruthy();

    expect(DataContext).toBeDefined();
    expect(dataContext).toBeDefined();
    expect(dataContext instanceof DataContext).toBeTruthy();
  });

  it('should return the first city name value', () => {
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual.name).toBe('cityname1');
  });

  it('should not return the value of the last attached object', () => {
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.name).not.toBe('Smith');
  });

  it('should return the value of the first attached object', () => {
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.name).toBe('Quimby');
  });

  it('should return the same value with a cyclic dependency', () => {
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');
    major.city = city;
    city.major = major;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.city?.name).toBe('cityname');
    expect(actual.city?.id).toBe('cityId');
  });

  it('should not return the last values attached of a plain object', () => {
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    dataContext.attach(city, mergeStrategy);
    dataContext.attach(person, mergeStrategy);
    let actual = dataContext.attach(plainObject, mergeStrategy);

    expect(actual.person.name).not.toBe('valerio2');
    expect(actual.city.name).not.toBe('New City Name');
  });

  it('should return the first values attached of a plain object', () => {
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    dataContext.attach(city, mergeStrategy);
    dataContext.attach(person, mergeStrategy);
    let actual = dataContext.attach(plainObject, mergeStrategy);

    expect(actual.person.name).toBe('valerio');
    expect(actual.city.name).toBe('City Name');
  });
});

// Integration tests
describe('Integration tests - OverwriteAlways', () => {

  let mergeStrategy: OverwriteAlwaysStrategy, dataContext: DataContext;

  beforeEach(() => {
    mergeStrategy = new OverwriteAlwaysStrategy();
    dataContext = new DataContext();
  });

  it('should be defined', () => {
    expect(OverwriteAlwaysStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof OverwriteAlwaysStrategy).toBeTruthy();

    expect(DataContext).toBeDefined();
    expect(dataContext).toBeDefined();
    expect(dataContext instanceof DataContext).toBeTruthy();
  });

  it('should not return the the first city name value', () => {
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual.name).not.toBe('cityname1');
  });

  it('should return the last city name value', () => {
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual.name).toBe('cityname2');
  });

  it('should not return the value of the first attached object', () => {
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.name).not.toBe('Quimby');
  });

  it('should return the value of the last attached object', () => {
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.name).toBe('Smith');
  });

  it('should return the same value with a cyclic dependency', () => {
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');
    major.city = city;
    city.major = major;

    dataContext.attach(city, mergeStrategy);
    let actual = dataContext.attach(major, mergeStrategy);

    expect(actual.city?.name).toBe('cityname');
    expect(actual.city?.id).toBe('cityId');
  });

  it('should not return the first values attached of a plain object', () => {
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    dataContext.attach(city, mergeStrategy);
    dataContext.attach(person, mergeStrategy);
    let actual = dataContext.attach(plainObject, mergeStrategy);

    expect(actual.person.name).not.toBe('valerio');
    expect(actual.city.name).not.toBe('City Name');
  });

  it('should return the last values attached of a plain object', () => {
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    dataContext.attach(city, mergeStrategy);
    dataContext.attach(person, mergeStrategy);
    let actual = dataContext.attach(plainObject, mergeStrategy);

    expect(actual.person.name).toBe('valerio2');
    expect(actual.city.name).toBe('New City Name');
  });

  it('should attach updated date property', () => {
    let person = new Person('2', 'valerio', 'como', 'mail@email.it', new Date(2016, 1, 1));
    dataContext.attach(person, mergeStrategy);
    let updatedPerson = new Person('2', 'valerio', 'commo', 'mail@email.it', new Date(1980, 1, 1));

    let actual = dataContext.attach(updatedPerson, mergeStrategy);

    expect(actual.birthDate?.getFullYear()).toBe(1980);
  });

  it('should attach updated navigational property with cardinality = 1', () => {
    let coach = new Person('2', 'valerio', 'como', 'mail@email.it');
    let team = new BasketTeam('bari1', coach);
    dataContext.attach(team, mergeStrategy);
    let updatedCoach = new Person('2', 'valerio', 'commo', 'mail@email.it');
    let updatedTeam = new BasketTeam('bari1', updatedCoach);

    let actual = dataContext.attach(updatedTeam, mergeStrategy);

    expect(actual.coach.surname).toBe('commo');
  });

  it('should attach updated navigational property with cardinality = n', () => {
    let player = new Person('2', 'valerio', 'como', 'mail@email.it');
    let team = new BasketTeam('bari1', null!, [player]);
    dataContext.attach(team, mergeStrategy);
    let updatedPalyer = new Person('2', 'valerio', 'commo', 'mail@email.it');
    let updatedTeam = new BasketTeam('bari1', null!, [updatedPalyer]);

    let actual = dataContext.attach(updatedTeam, mergeStrategy);

    expect(actual.players[0].surname).toBe('commo');
  });
});

// Integration tests
describe('Integration tests - OverwriteIfNotChanged', () => {

  let mergeStrategy: OverwriteIfNotChangedStrategy, dataContext: DataContext;

  beforeEach(() => {
    mergeStrategy = new OverwriteIfNotChangedStrategy();
    dataContext = new DataContext();
  });

  let changeState = (object: IObjectWithChangeTracker, state: ObjectState) => {
    object.changeTracker.changeTrackingEnabled = true;
    object.changeTracker.state = state;
  };

  it('should be defined', () => {
    expect(OverwriteIfNotChangedStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof OverwriteIfNotChangedStrategy).toBeTruthy();

    expect(DataContext).toBeDefined();
    expect(dataContext).toBeDefined();
    expect(dataContext instanceof DataContext).toBeTruthy();
  });

  it('should return attached object with old values if the state is added', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    let attachedEntity = dataContext.attach(attachedObject, mergeStrategy);
    changeState(attachedEntity, ObjectState.added);
    let actual = dataContext.attach(newObject, mergeStrategy);

    expect(actual.name).toBe('John');
  });

  it('should return attached object with old values if the state is modified', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    let attachedEntity = dataContext.attach(attachedObject, mergeStrategy);
    changeState(attachedEntity, ObjectState.modified);
    let actual = dataContext.attach(newObject, mergeStrategy);

    expect(actual.name).toBe('John');
  });

  it('should return attached object with old values if the state is deleted', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    let attachedEntity = dataContext.attach(attachedObject, mergeStrategy);
    changeState(attachedEntity, ObjectState.deleted);
    let actual = dataContext.attach(newObject, mergeStrategy);

    expect(actual.name).toBe('John');
  });

  it('should return attached object with new values if the state is unchanged', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    let attachedEntity = dataContext.attach(attachedObject, mergeStrategy);
    changeState(attachedEntity, ObjectState.unchanged);
    let actual = dataContext.attach(newObject, mergeStrategy);

    expect(actual.name).toBe('Jack');
  });
});

describe('Integration test - Custom merge strategy', () => {

  class CustomMergeStrategy implements IMergeStrategy {
    public merge<T>(root: T, attachedObject: T) {
      return attachedObject;
    }
  }

  let mergeStrategy: CustomMergeStrategy, dataContext: DataContext;

  beforeEach(() => {
    mergeStrategy = new CustomMergeStrategy();
    dataContext = new DataContext();
  });

  it('should not return a value from the last attached object', () => {
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual.name).not.toBe('new city name');
  });

  it('should return a value from the first attached object', () => {
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual.name).toBe('city name');
  });

  it('should not return the last attached object', () => {
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual).not.toBe(city2);
  });

  it('should return always an attached object', () => {
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    let expected = dataContext.attach(city1, mergeStrategy);
    let actual = dataContext.attach(city2, mergeStrategy);

    expect(actual).toBe(expected);
  });
});
