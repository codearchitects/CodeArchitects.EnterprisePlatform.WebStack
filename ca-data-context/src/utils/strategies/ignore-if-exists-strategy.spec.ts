import { IgnoreIfExistsStrategy } from './ignore-if-exists-strategy';
import { IMergeStrategy } from '../merge-strategy';
import { Person } from '../fixtures/models';

describe('IgnoreIfExistsStrategy', () => {

  let mergeStrategy: IMergeStrategy;

  beforeEach(() => {
    // Arrange
    mergeStrategy = new IgnoreIfExistsStrategy();
  });

  it('should be defined', () => {
    // Assert
    expect(IgnoreIfExistsStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof IgnoreIfExistsStrategy).toBe(true);
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

  it('should return the new object if attached object is undefined', () => {
    // Arrange
    let attachedObject = undefined;
    let newObject = new Person();
    newObject.name = 'Jack';

    // Act
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toBe(newObject);
  });

  it('should return the attached object with old values', () => {
    // Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();
    newObject.name = 'Jack';

    // Act
    let expected = new Person();
    expected.name = 'Jhon';
    let actual = mergeStrategy.merge(newObject, attachedObject);

    // Assert
    expect(actual).toEqual(expected);
  });
});
