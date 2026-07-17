import { IgnoreIfExistsStrategy } from './ignore-if-exists-strategy';
import { IMergeStrategy } from '../merge-strategy';
import { Person } from '../fixtures/models';
import { expect } from 'chai';

describe('IgnoreIfExistsStrategy', () => {

  beforeEach(() => {
    // Arrange
    this.mergeStrategy = new IgnoreIfExistsStrategy();
  });

  it('should be defined', () => {
    // Assert
    expect(IgnoreIfExistsStrategy).to.exist;
    expect(this.mergeStrategy).to.exist;
    expect(this.mergeStrategy instanceof IgnoreIfExistsStrategy).to.be.true;
  });

  it('should return the attached object', () => {
    //Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();
    newObject.name = 'Jack';

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual).to.be.equal(attachedObject);
  });

  it('should return the new object if attached object is undefined', () => {
    //Arrange
    let attachedObject = undefined;
    let newObject = new Person();
    newObject.name = 'Jack';

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual).to.be.equal(newObject);
  });

  it('should return the attached object with old values', () => {
    //Arrange
    let attachedObject = new Person();
    attachedObject.name = 'Jhon';
    let newObject = new Person();
    newObject.name = 'Jack';

    //Act
    let expected = new Person();
    expected.name = 'Jhon';
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual).to.be.deep.equal(expected);
  });
});

