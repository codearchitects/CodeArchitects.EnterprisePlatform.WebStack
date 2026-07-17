import { IObjectWithChangeTracker, ObjectState } from '@ca-webstack/change-tracker';
import { IgnoreIfExistsStrategy, OverwriteAlwaysStrategy, OverwriteIfNotChangedStrategy } from '../utils/strategies';
import { IMergeStrategy } from '../utils/merge-strategy';
import { DataContext } from '../services/data-context';
import { City, Major, Person, BasketTeam } from './fixtures/models';
import { TrackedPerson } from '../utils/fixtures/models';
import { expect } from 'chai';
// Integration tests
describe('Integration tests - IgnoreIfExistsStrategy', () => {

  beforeEach(() => {
    this.mergeStrategy = new IgnoreIfExistsStrategy();
    this.dataContext = new DataContext();
  });

  it('should be defined', () => {
    // Assert
    expect(IgnoreIfExistsStrategy).to.exist;
    expect(this.mergeStrategy).to.exist;
    expect(this.mergeStrategy instanceof IgnoreIfExistsStrategy).to.be.true;

    expect(DataContext).to.exist;
    expect(this.dataContext).to.exist;
    expect(this.dataContext instanceof DataContext).to.be.true;
  });

  it('should return the first city name value', () => {
    //Arrange
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    //Act
    (<DataContext>this.dataContext).attach(city1, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(city2, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.deep.equal('cityname1');
  });

  it('should not return the value of the last attached object', () => {
    //Arrange
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.name).not.to.be.deep.equal('Smith');
  });

  it('should return the value of the first attached object', () => {
    //Arrange
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.deep.equal('Quimby');
  });

  it('should return the same value with a cyclic dependency', () => {
    //Arrange
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');
    major.city = city;
    city.major = major;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.city.name).to.be.deep.equal('cityname');
    expect(actual.city.id).to.be.deep.equal('cityId');
  });

  it('should not return the last values attached of a plain object', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    (<DataContext>this.dataContext).attach(person, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(plainObject, this.mergeStrategy);

    //Assert
    expect(actual.person.name).not.to.be.equal('valerio2');
    expect(actual.city.name).not.to.be.equal('New City Name');
  });

  it('should return the first values attached of a plain object', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    (<DataContext>this.dataContext).attach(person, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(plainObject, this.mergeStrategy);

    //Assert
    expect(actual.person.name).to.be.equal('valerio');
    expect(actual.city.name).to.be.equal('City Name');
  });
});

//Integration tests
describe('Integration tests - OverwriteAlways', () => {

  beforeEach(() => {
    this.mergeStrategy = new OverwriteAlwaysStrategy();
    this.dataContext = new DataContext();
  });

  it('should be defined', () => {
    // Assert
    expect(OverwriteAlwaysStrategy).to.exist;
    expect(this.mergeStrategy).to.exist;
    expect(this.mergeStrategy instanceof OverwriteAlwaysStrategy).to.be.true;

    expect(DataContext).to.exist;
    expect(this.dataContext).to.exist;
    expect(this.dataContext instanceof DataContext).to.be.true;
  });

  it('should not return the the first city name value', () => {
    //Arrange
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    //Act
    (<DataContext>this.dataContext).attach(city1, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(city2, this.mergeStrategy);

    //Assert
    expect(actual.name).not.to.be.deep.equal('cityname1');
  });

  it('should return the last city name value', () => {
    //Arrange
    let city1 = new City('cityId', 'cityname1');
    let city2 = new City('cityId', 'cityname2');

    //Act
    (<DataContext>this.dataContext).attach(city1, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(city2, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.deep.equal('cityname2');
  });

  it('should not return the value of the first attached object', () => {
    //Arrange
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.name).not.to.be.deep.equal('Quimby');
  });

  it('should return the value of the last attached object', () => {
    //Arrange
    let city = new City('cityId', 'cityname', new Major('majorId', 'Quimby'));
    let major = new Major('majorId', 'Smith');
    major.city = city;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.deep.equal('Smith');
  });

  it('should return the same value with a cyclic dependency', () => {
    //Arrange
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');
    major.city = city;
    city.major = major;

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(major, this.mergeStrategy);

    //Assert
    expect(actual.city.name).to.be.deep.equal('cityname');
    expect(actual.city.id).to.be.deep.equal('cityId');
  });

  it('should not return the first values attached of a plain object', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    (<DataContext>this.dataContext).attach(person, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(plainObject, this.mergeStrategy);

    //Assert
    expect(actual.person.name).not.to.be.equal('valerio');
    expect(actual.city.name).not.to.be.equal('City Name');
  });

  it('should return the last values attached of a plain object', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio2', 'como', 'mail@email.it'),
      city: new City('cityId', 'New City Name')
    };

    //Act
    (<DataContext>this.dataContext).attach(city, this.mergeStrategy);
    (<DataContext>this.dataContext).attach(person, this.mergeStrategy);
    let actual = (<DataContext>this.dataContext).attach(plainObject, this.mergeStrategy);

    //Assert
    expect(actual.person.name).to.be.equal('valerio2');
    expect(actual.city.name).to.be.equal('New City Name');
  });

  it('should attach updated date property', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it', new Date(2016, 1, 1));
    (<DataContext>this.dataContext).attach(person, this.mergeStrategy);
    let updatedPerson = new Person('2', 'valerio', 'commo', 'mail@email.it', new Date(1980, 1, 1));

    //Act
    let actual = (<DataContext>this.dataContext).attach(updatedPerson, this.mergeStrategy);

    //Assert
    expect(actual.birthDate.getFullYear()).to.be.equal(1980);
  });

  it('should attach updated navigational property with cardinality = 1', () => {
    //Arrange
    let coach = new Person('2', 'valerio', 'como', 'mail@email.it');
    let team = new BasketTeam('bari1', coach);
    (<DataContext>this.dataContext).attach(team, this.mergeStrategy);
    let updatedCoach = new Person('2', 'valerio', 'commo', 'mail@email.it');
    let updatedTeam = new BasketTeam('bari1', updatedCoach);

    //Act
    let actual = (<DataContext>this.dataContext).attach(updatedTeam, this.mergeStrategy);

    //Assert
    expect(actual.coach.surname).to.be.equal('commo');
  });

  it('should attach updated navigational property with cardinality = n', () => {
    //Arrange
    let player = new Person('2', 'valerio', 'como', 'mail@email.it');
    let team = new BasketTeam('bari1', null, [player]);
    (<DataContext>this.dataContext).attach(team, this.mergeStrategy);
    let updatedPalyer = new Person('2', 'valerio', 'commo', 'mail@email.it');
    let updatedTeam = new BasketTeam('bari1', null, [updatedPalyer]);

    //Act
    let actual = (<DataContext>this.dataContext).attach(updatedTeam, this.mergeStrategy);

    //Assert
    expect(actual.players[0].surname).to.be.equal('commo');
  });
});

//Integration tests
describe('Integration tests - OverwriteIfNotChanged', () => {

  beforeEach(() => {
    this.mergeStrategy = new OverwriteIfNotChangedStrategy();
    this.dataContext = new DataContext();
  });

  let changeState = (object: IObjectWithChangeTracker, state: ObjectState) => {
    object.changeTracker.changeTrackingEnabled = true;
    object.changeTracker.state = state;
  };

  it('should be defined', () => {
    // Assert
    expect(OverwriteIfNotChangedStrategy).to.exist;
    expect(this.mergeStrategy).to.exist;
    expect(this.mergeStrategy instanceof OverwriteIfNotChangedStrategy).to.be.true;

    expect(DataContext).to.exist;
    expect(this.dataContext).to.exist;
    expect(this.dataContext instanceof DataContext).to.be.true;
  });

  it('should return attached object with old values if the state is added', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    //Act
    let attachedEntity = (<DataContext>this.dataContext).attach(attachedObject, this.mergeStrategy);
    changeState(attachedEntity, ObjectState.added);
    let actual = (<DataContext>this.dataContext).attach(newObject, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should return attached object with old values if the state is modified', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    //Act
    let attachedEntity = (<DataContext>this.dataContext).attach(attachedObject, this.mergeStrategy);
    changeState(attachedEntity, ObjectState.modified);
    let actual = (<DataContext>this.dataContext).attach(newObject, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should return attached object with old values if the state is deleted', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    //Act
    let attachedEntity = (<DataContext>this.dataContext).attach(attachedObject, this.mergeStrategy);
    changeState(attachedEntity, ObjectState.deleted);
    let actual = (<DataContext>this.dataContext).attach(newObject, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should return attached object with new values if the state is unchanged', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.id = 1;
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.id = 1;
    newObject.name = 'Jack';

    //Act
    let attachedEntity = (<DataContext>this.dataContext).attach(attachedObject, this.mergeStrategy);
    changeState(attachedEntity, ObjectState.unchanged);
    let actual = (<DataContext>this.dataContext).attach(newObject, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.equal('Jack');
  });
});


describe('Integration test - Custom merge strategy', () => {

  // A dummy merge strategy example
  // A strategy must implements IMergeStrategy
  class CustomMergeStrategy implements IMergeStrategy {
    public merge<T>(root: T, attachedObject: T) {
      return attachedObject;
    }
  }

  beforeEach(() => {
    this.mergeStrategy = new CustomMergeStrategy();
    this.dataContext = new DataContext();
  });

  it('should not return a value form the last attached object', () => {
    //Arrange
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    //Act
    this.dataContext.attach(city1, this.mergeStrategy);
    let actual = this.dataContext.attach(city2, this.mergeStrategy);

    //Assert
    expect(actual.name).not.to.be.equal('new city name');
  });

  it('should return a value form the first attached object', () => {
    //Arrange
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    //Act
    this.dataContext.attach(city1, this.mergeStrategy);
    let actual = this.dataContext.attach(city2, this.mergeStrategy);

    //Assert
    expect(actual.name).to.be.equal('city name');
  });

  it('should not return the last attached object', () => {
    //Arrange
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    //Act
    this.dataContext.attach(city1, this.mergeStrategy);
    let actual = this.dataContext.attach(city2, this.mergeStrategy);

    //Assert
    expect(actual).not.to.be.equal(city2);
  });

  it('should return always an attached object', () => {
    //Arrange
    let city1 = new City('cityId', 'city name');
    let city2 = new City('cityId', 'new city name');

    //Act
    let expected = this.dataContext.attach(city1, this.mergeStrategy);
    let actual = this.dataContext.attach(city2, this.mergeStrategy);

    //Assert
    expect(actual).to.be.equal(expected);
  });
});
