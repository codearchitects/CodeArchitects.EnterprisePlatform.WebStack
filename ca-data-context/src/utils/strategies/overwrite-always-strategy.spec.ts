import { OverwriteAlwaysStrategy } from './overwrite-always-strategy';
import { IMergeStrategy } from '../merge-strategy';
import { Person, PersonWithAge, PersonWithAddress, PersonWithAddresses, Address } from '../fixtures/models';

describe('OverwriteAlwaysStrategy', () => {

  let mergeStrategy: IMergeStrategy;

  beforeEach(() => {
    // Arrange
    mergeStrategy = new OverwriteAlwaysStrategy();
  });

  it('should be defined', () => {
    // Assert
    expect(OverwriteAlwaysStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof OverwriteAlwaysStrategy).toBe(true);
  });

  it('should return the attached object', () => {
    // Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();
    newObject.name = 'Jack';

    // Act
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toBe(attachedObject);
  });

  it('should return the attached object with new values', () => {
    // Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();
    newObject.name = 'Jack';

    // Act
    let expected = new Person();
    expected.name = 'Jack';
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should return the attached object with null values', () => {
    // Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();

    // Act
    let expected = new Person();
    expected.name = undefined!;
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should return the attached object with new date values', () => {
    // Arrange
    let attachedObject = new Person();
    attachedObject.birthday = new Date(2015, 1, 1);
    let newObject = new Person();
    newObject.birthday = new Date(2016, 2, 20);

    // Act
    let expected = new Person();
    expected.birthday = new Date(2016, 2, 20);
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should return the attached object with new parent\'s values', () => {
    // Arrange
    let attachedObject = new PersonWithAge();
    attachedObject.name = 'John';
    attachedObject.age = 22;
    let newObject = new PersonWithAge();
    newObject.name = 'Jack';
    newObject.age = 24;

    // Act
    let expected = new PersonWithAge();
    expected.name = 'Jack';
    expected.age = 24;
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should return the attached object without new single association', () => {
    // Arrange
    let attachedAddress = new Address();
    attachedAddress.street = 'Main street';
    let attachedObject = new PersonWithAddress();
    attachedObject.name = 'Jhon';
    attachedObject.address = attachedAddress;
    let newAddress = new Address();
    newAddress.street = 'Second street';
    let newObject = new PersonWithAddress();
    newObject.name = 'Jack';
    newObject.address = newAddress;

    // Act
    let expected = new PersonWithAddress();
    expected.name = 'Jack';
    expected.address = attachedAddress;
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should return the attached object without new multiple association', () => {
    // Arrange
    let attachedAddress = new Address();
    attachedAddress.street = 'Main street';
    let attachedObject = new PersonWithAddresses();
    attachedObject.name = 'Jhon';
    attachedObject.addresses = [attachedAddress];
    let newAddress = new Address();
    newAddress.street = 'Second street';
    let newObject = new PersonWithAddresses();
    newObject.name = 'Jack';
    newObject.addresses = [newAddress];

    // Act
    let expected = new PersonWithAddresses();
    expected.name = 'Jack';
    expected.addresses = [attachedAddress];
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should attach a brand new DateTime', () => {
    // Arrange
    let oldObject = { nome: 'Piero', date: { time: new Date(1987, 2, 15), toDate: () => new Date() } };
    let newObject = { nome: 'Davide', date: { time: new Date(1987, 2, 18), toDate: () => new Date() } };

    // Act
    let actual = mergeStrategy.merge(newObject, oldObject);

    // Assert
    expect(actual === oldObject).toBe(true);
    expect(actual.nome).toBe('Davide');
    expect(actual.date).toBe(oldObject.date);
    expect(actual.date.time).toBe(oldObject.date.time);
  });
});
