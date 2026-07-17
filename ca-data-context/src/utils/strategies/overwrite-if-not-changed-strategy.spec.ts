import { ObjectState } from '@ca-webstack/change-tracker';
import { OverwriteIfNotChangedStrategy } from './overwrite-if-not-changed-strategy';
import { IMergeStrategy } from '../merge-strategy';
import { TrackedPerson } from '../fixtures/models';
import { expect } from 'chai';


describe('OverwriteIfNotChangedStrategy', () => {

  beforeEach(() => {
    // Arrange
    this.mergeStrategy = new OverwriteIfNotChangedStrategy();
  });

  it('should be defined', () => {
    // Assert
    expect(OverwriteIfNotChangedStrategy).to.exist;
    expect(this.mergeStrategy).to.exist;
    expect(this.mergeStrategy instanceof OverwriteIfNotChangedStrategy).to.be.true;
  });

  it('should return the attached object', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual).to.be.equal(attachedObject);
  });

  it('should not overwrite the old object values if changeTracker state is added', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.added;

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should not overwrite the old object values if changeTracker state is modified', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.modified;

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should not overwrite the old object values if changeTracker state is deleted', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.deleted;

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual.name).to.be.equal('John');
  });

  it('should overwrite the old object values if changeTracker state is unchanged', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.unchanged;

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual.name).to.be.equal('Jack');
  });

  it('should unset an object property if missing in the new object', () => {
    //Arrange
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.unchanged;

    //Act
    let actual = (<IMergeStrategy>this.mergeStrategy).merge(newObject, attachedObject);

    //Assert
    expect(actual.name).to.be.undefined;
  });

});
