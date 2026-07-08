import 'core-js';
import { jest } from '@jest/globals';
import { Serializer } from '@ca-webstack/reflection';
import {
  ObjectWithChangeTrackerExtensions,
  TrackableCollectionFactory,
  ObjectList,
  ObjectState
} from './index';
import { Game, Person, Work } from './fixtures';

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
        state: 1,
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
              state: 1,
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

    it('should set Object State to Unchanged on creation', () => {
      // Assert
      expect(log.changeTracker.state).toBe(ObjectState.unchanged);
    });

    it('should emit a property changed event on property change', () => {
      // Arrange
      const onNext = jest.fn();
      log.propertyChanged.subscribe(onNext);

      // Act
      log.firstName = 'John';

      // Assert
      expect(onNext).toHaveBeenCalledWith({ propertyName: 'firstName' });
    });

    it('should set Object State to Unchanged on changes accepted', () => {
      // Act
      log.changeTracker.acceptChanges();

      // Assert
      expect(log.changeTracker.state).toBe(ObjectState.unchanged);
    });

    it('should set Object State to Modified on property change', () => {
      // Arrange
      log.changeTracker.acceptChanges();

      // Act
      log.firstName = 'John';

      // Assert
      expect(log.changeTracker.state).toBe(ObjectState.modified);
    });

    it('should store original value on property change', () => {
      // Arrange
      log.firstName = 'John';
      log.changeTracker.acceptChanges();

      // Act
      log.firstName = 'Jane';

      // Assert
      expect(log.changeTracker.originalValues.get('firstName')).toBe('John');
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
      const onNext = jest.fn();
      person.dateOfBirth.propertyChanged.subscribe(onNext);

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(onNext).toHaveBeenCalledWith({ propertyName: 'date' });
    });

    it('should emit a complex property changing event on complex property change', () => {
      // Arrange
      const onNext = jest.fn();
      person.dateOfBirth.complexPropertyChanging.subscribe(onNext);

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(onNext).toHaveBeenCalledWith(null);
    });

    it('shold set Object State to Modified on complex property change', () => {
      // Arrange
      person.changeTracker.acceptChanges();

      // Act
      person.dateOfBirth.date = '1980-01-01';

      // Assert
      expect(person.changeTracker.state).toBe(ObjectState.modified);
    });

    it('should store original value on complex property change', () => {
      // Arrange
      person.dateOfBirth.date = '1980-01-01';
      person.changeTracker.acceptChanges();

      // Act
      person.dateOfBirth.date = '1985-12-31';

      // Assert
      expect(person.changeTracker.originalValues.get('dateOfBirth.date')).toBe('1980-01-01');
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
      expect(person.job.persons.includes(person)).toBe(true);
    });

    it('should emit a property changed event on navigational property change', () => {
      // Arrange
      const onNext = jest.fn();
      person.propertyChanged.subscribe(onNext);

      // Act
      person.job = work;

      // Assert
      expect(onNext).toHaveBeenCalledWith({ propertyName: 'job' });
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
      expect(person.changeTracker.originalValues.get('job')).toBe(work1);
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
      expect(work.persons[0].job).toBe(work);
    });

    it('should emit a property changed event on navigational property change', () => {
      // Arrange
      const onNext = jest.fn();
      work.propertyChanged.subscribe(onNext);

      // Act
      work.persons = [person];

      // Assert
      expect(onNext).toHaveBeenCalledWith({ propertyName: 'persons' });
    });

    it('should store added item on navigational property change', () => {
      // Arrange
      work.changeTracker.acceptChanges();

      // Act
      work.persons.push(person);

      // Assert
      expect(work.changeTracker.objectsAddedToCollectionProperties.containsKey('persons')).toBe(true);
      expect(work.changeTracker.objectsAddedToCollectionProperties.get('persons').contains(person)).toBe(true);
    });

    it('should store removed item on navigational property change', () => {
      // Arrange
      work.persons.push(person);
      work.changeTracker.acceptChanges();

      // Act
      work.persons.splice(0, 1);

      // Assert
      expect(work.changeTracker.objectsRemovedFromCollectionProperties.containsKey('persons')).toBe(true);
      expect(work.changeTracker.objectsRemovedFromCollectionProperties.get('persons').contains(person)).toBe(true);
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
        expect(person.changeTracker.changeTrackingEnabled).toBe(true);
      });

      it('should enable change tracker on children of untrackable element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = false;
        const obj = { person: person };

        // Act
        ObjectWithChangeTrackerExtensions.enableChangeTracking(obj);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).toBe(true);
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
        expect(job.changeTracker.changeTrackingEnabled).toBe(true);
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
        expect(hobby.changeTracker.changeTrackingEnabled).toBe(true);
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
        expect(person.changeTracker.changeTrackingEnabled).toBe(false);
      });

      it('should disable change tracker on children of untrackable element', () => {
        // Arrange
        const person = new Person();
        person.changeTracker.changeTrackingEnabled = true;
        const obj = { person: person };

        // Act
        ObjectWithChangeTrackerExtensions.disableChangeTracking(obj);

        // Assert
        expect(person.changeTracker.changeTrackingEnabled).toBe(false);
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
        expect(job.changeTracker.changeTrackingEnabled).toBe(false);
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
        expect(hobby.changeTracker.changeTrackingEnabled).toBe(false);
      });
    });
  });

  describe('TrackableCollection', () => {
    it('should be initializable without params', () => {
      // Act
      const trackableCollection = TrackableCollectionFactory.getInstance();

      // Assert
      expect(trackableCollection).toBeDefined();
    });

    it('should be initializable with params', () => {
      // Act
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);

      // Assert
      expect(trackableCollection).toBeDefined();
      expect(trackableCollection[0]).toBe(31);
      expect(trackableCollection[1]).toBe(10);
    });

    it('should add item through bracket operator', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance();

      // Act
      trackableCollection[0] = 31;

      // Assert
      expect(trackableCollection[0]).toBe(31);
    });

    it('should add item through push operator', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance();

      // Act
      trackableCollection.push(31);

      // Assert
      expect(trackableCollection[0]).toBe(31);
    });

    it('should implements reduce', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);

      // Act
      const actual = trackableCollection.reduce((memo, item) => memo + item, 0);

      // Assert
      expect(actual).toBe(41);
    });

    it('should emit event on assignment', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);
      const callback = jest.fn();
      trackableCollection.collectionChanged.subscribe(callback);

      // Act
      trackableCollection[1] = 30;

      // Assert
      expect(callback).toHaveBeenCalledWith({ newItems: [30], oldItems: [10] });
    });

    it('should emit event on delete', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10);
      const callback = jest.fn();
      trackableCollection.collectionChanged.subscribe(callback);

      // Act
      delete trackableCollection[1];

      // Assert
      expect(callback).toHaveBeenCalledWith({ newItems: null, oldItems: [10] });
    });

    it('should emit event on push', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance();
      const callback = jest.fn();
      trackableCollection.collectionChanged.subscribe(callback);

      // Act
      trackableCollection.push(31, 10);

      // Assert
      expect(callback).toHaveBeenCalledWith({ newItems: [31, 10], oldItems: null });
    });

    it('should emit event on splice', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10, 44);
      const callback = jest.fn();
      trackableCollection.collectionChanged.subscribe(callback);

      // Act
      trackableCollection.splice(1);

      // Assert
      expect(callback).toHaveBeenCalledWith({ newItems: null, oldItems: [44, 10] });
    });

    it('should emit event on splice with substitutions', () => {
      // Arrange
      const trackableCollection = TrackableCollectionFactory.getInstance(31, 10, 44);
      const callback = jest.fn();
      trackableCollection.collectionChanged.subscribe(callback);

      // Act
      trackableCollection.splice(1, 2, 11, 12);

      // Assert
      expect(callback).toHaveBeenCalledWith({ newItems: [11, 12], oldItems: [10, 44] });
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
      expect(actual).toEqual(personWithFirstNameSerialized);
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
      expect(actual).toEqual(personWithHobbiesSerialized);
    });

    it('should serialize entity correctly', () => {
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
      expect(actual.changeTracker.objectsAddedToCollectionProperties.values[0]).toBeInstanceOf(ObjectList);
    });
  });
});
