import { ObjectState } from '@ca-webstack/change-tracker';
import { OverwriteIfNotChangedStrategy } from './overwrite-if-not-changed-strategy';
import { IMergeStrategy } from '../merge-strategy';
import { TrackedPerson } from '../fixtures/models';

describe('OverwriteIfNotChangedStrategy', () => {

  let mergeStrategy: IMergeStrategy;

  beforeEach(() => {
    mergeStrategy = new OverwriteIfNotChangedStrategy();
  });

  it('should be defined', () => {
    expect(OverwriteIfNotChangedStrategy).toBeDefined();
    expect(mergeStrategy).toBeDefined();
    expect(mergeStrategy instanceof OverwriteIfNotChangedStrategy).toBeTruthy();
  });

  it('should return the attached object', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual).toBe(attachedObject);
  });

  it('should not overwrite the old object values if changeTracker state is added', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.added;

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual.name).toBe('John');
  });

  it('should not overwrite the old object values if changeTracker state is modified', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.modified;

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual.name).toBe('John');
  });

  it('should not overwrite the old object values if changeTracker state is deleted', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.deleted;

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual.name).toBe('John');
  });

  it('should overwrite the old object values if changeTracker state is unchanged', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();
    newObject.name = 'Jack';

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.unchanged;

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual.name).toBe('Jack');
  });

  it('should unset an object property if missing in the new object', () => {
    let attachedObject = new TrackedPerson();
    attachedObject.name = 'John';
    let newObject = new TrackedPerson();

    attachedObject.changeTracker.changeTrackingEnabled = true;
    attachedObject.changeTracker.state = ObjectState.unchanged;

    let actual = mergeStrategy.merge(newObject, attachedObject);

    expect(actual.name).toBeUndefined();
  });

});
