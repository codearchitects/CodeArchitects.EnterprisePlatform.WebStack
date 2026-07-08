# ca-change-tracker — API Documentation

## Why use this package

`@ca-webstack/change-tracker` implements the **Self-Tracking Entities** pattern in TypeScript. It lets your domain objects track their own state changes — property edits, collection additions/removals — so that a persistence layer can determine exactly what has changed and issue the minimal set of operations.

Key benefits:

- **Automatic dirty tracking** — property mutations are recorded transparently.
- **Collection-level tracking** — additions and removals on collection properties are tracked separately.
- **Reactive events** — state changes and collection mutations are emitted as RxJS observables.
- **Serialisation-friendly** — all tracker classes are decorated with `@JsonObject` / `@JsonProperty` for seamless serialisation via `@ca-webstack/reflection`.

---

## Features

- `ObjectState` enum: `detached` (0), `unchanged` (1), `added` (2), `modified` (4), `deleted` (8).
- `ObjectChangeTracker` — core tracker attached to each entity.
- `IObjectWithChangeTracker` — interface contract for trackable entities.
- `ObjectWithChangeTrackerExtensions` — static utility methods for bulk state management.
- `TrackableCollection<T>` — observable array that emits `collectionChanged`.
- `TrackableCollectionFactory` — creates proxy-wrapped trackable collections.
- `TrackableCollectionUtils` — convert between plain arrays and trackable collections.
- Supporting dictionaries: `OriginalValuesDictionary`, `ExtendedPropertiesDictionary`, `ObjectsAddedToCollectionProperties`, `ObjectsRemovedFromCollectionProperties`.

---

## API Reference

### Enum: `ObjectState`

Represents the lifecycle state of a self-tracking entity.

| Member | Value | Description |
|---|---|---|
| `detached` | `0` | Entity is not attached to any context. |
| `unchanged` | `0x1` | Entity has not been modified since last accept. |
| `added` | `0x2` | Entity has been newly created. |
| `modified` | `0x4` | One or more properties have changed. |
| `deleted` | `0x8` | Entity has been marked for deletion. |

---

### Interface: `IObjectWithChangeTracker`

```typescript
interface IObjectWithChangeTracker {
  changeTracker: ObjectChangeTracker;
}
```

Any entity that needs change tracking must implement this interface.

---

### Interface: `INotifyPropertyChanged`

```typescript
interface INotifyPropertyChanged {
  propertyChanged: Subject<PropertyChangedEventArgs>;
}
```

Implemented by entities that emit property-change notifications.

#### `PropertyChangedEventArgs`

```typescript
interface PropertyChangedEventArgs {
  propertyName: string;
}
```

---

### Interface: `INotifyComplexPropertyChanging`

```typescript
interface INotifyComplexPropertyChanging {
  complexPropertyChanging: Subject<any>;
}
```

Implemented by entities that emit notifications when a complex (nested) property is about to change.

---

### Interface: `NotifyCollectionChangedEventArgs<T>`

```typescript
interface NotifyCollectionChangedEventArgs<T> {
  newItems: Array<T>;
  oldItems: Array<T>;
}
```

Payload emitted by `TrackableCollection.collectionChanged`.

---

### Interface: `ObjectStateChangingEventArgs`

```typescript
interface ObjectStateChangingEventArgs {
  newState: ObjectState;
}
```

Payload emitted by `ObjectChangeTracker.objectStateChanging`.

---

### Class: `ObjectChangeTracker`

The core tracker that is attached to each self-tracking entity.

#### Properties

| Property | Type | Description |
|---|---|---|
| `objectStateChanging` | `Subject<ObjectStateChangingEventArgs>` | RxJS subject that emits before the state changes. |
| `objectStateChangingFn` | `(args: ObjectStateChangingEventArgs) => any` | Optional callback alternative to the observable. |
| `state` | `ObjectState` | Current lifecycle state. Setting this property emits a state-changing event (only when tracking is enabled or during deserialisation). |
| `changeTrackingEnabled` | `boolean` | Whether change tracking is currently active. |
| `originalValues` | `OriginalValuesDictionary` | Dictionary of property names → original values before mutation. |
| `extendedProperties` | `ExtendedPropertiesDictionary` | Dictionary for additional metadata. |
| `objectsAddedToCollectionProperties` | `ObjectsAddedToCollectionProperties` | Dictionary of property names → list of items added. |
| `objectsRemovedFromCollectionProperties` | `ObjectsRemovedFromCollectionProperties` | Dictionary of property names → list of items removed. |

#### Methods

| Method | Signature | Description |
|---|---|---|
| `acceptChanges` | `(entity?: any) => void` | Resets state to `unchanged`, clears original values and collection changes. Optionally recurses into nested tracked entities. |
| `recordOriginalValue` | `(propertyName: string, value: any) => void` | Saves the original value of a property (only first change is recorded; ignored for `added` entities). |
| `recordAdditionToCollectionProperties` | `(propertyName: string, value: any) => void` | Records that an item was added to a collection property. Automatically cancels a prior removal of the same item. |
| `recordRemovalFromCollectionProperties` | `(propertyName: string, value: any) => void` | Records that an item was removed from a collection property. Automatically cancels a prior addition of the same item. |

---

### Class: `ObjectWithChangeTrackerExtensions`

Static utility methods for managing tracked entities.

| Method | Signature | Description |
|---|---|---|
| `markAsDeleted` | `<T extends IObjectWithChangeTracker>(trackingItem: T) => T` | Enables tracking and sets state to `deleted`. |
| `markAsAdded` | `<T extends IObjectWithChangeTracker>(trackingItem: T) => T` | Enables tracking and sets state to `added`. |
| `markAsModified` | `<T extends IObjectWithChangeTracker>(trackingItem: T) => T` | Enables tracking and sets state to `modified`. |
| `markAsUnchanged` | `<T extends IObjectWithChangeTracker>(trackingItem: T) => T` | Enables tracking and sets state to `unchanged`. |
| `startTracking` | `(trackingItem: IObjectWithChangeTracker) => void` | Enables change tracking on the entity. |
| `stopTracking` | `(trackingItem: IObjectWithChangeTracker) => void` | Disables change tracking on the entity. |
| `enableChangeTracking` | `(trackingItem: any) => void` | Recursively enables change tracking on the entity and all nested trackable objects. |
| `disableChangeTracking` | `(trackingItem: any) => void` | Recursively disables change tracking on the entity and all nested trackable objects. |

---

### Class: `TrackableCollection<T>` (extends `Array<T>`)

An array subclass that emits change notifications.

| Member | Type | Description |
|---|---|---|
| `collectionChanged` | `Subject<NotifyCollectionChangedEventArgs<T>>` | RxJS subject emitting `{ newItems, oldItems }` on every mutation. |

> **Note:** Direct instantiation does not produce a proxy. Use `TrackableCollectionFactory.getInstance()` to get a fully reactive instance.

---

### Class: `TrackableCollectionFactory`

Factory that creates proxy-wrapped `TrackableCollection` instances.

| Method | Signature | Description |
|---|---|---|
| `getInstance` | `<T>(...items: T[]) => TrackableCollection<T>` | Returns a `Proxy`-backed trackable collection that automatically fires `collectionChanged` on `push`, `splice`, index assignment, and `delete`. |

---

### Class: `TrackableCollectionUtils`

Conversion helpers between plain arrays and trackable collections.

| Method | Signature | Description |
|---|---|---|
| `convertTcToArray` | `<T>(type: any, tc: TrackableCollection<T>) => T[]` | Converts a trackable collection to a plain array. |
| `convertArrayToTc` | `<T>(type: any, array: T[]) => TrackableCollection<T>` | Converts a plain array to a proxy-backed trackable collection. |

---

### Class: `OriginalValuesDictionary` (extends `Dictionary<string, any>`)

Stores original property values before mutation. Exposes `keys`, `values`, and `count`.

### Class: `ExtendedPropertiesDictionary` (extends `Dictionary<string, any>`)

Stores additional metadata. Same API as `OriginalValuesDictionary`.

### Class: `ObjectsAddedToCollectionProperties` (extends `Dictionary<string, ObjectList>`)

Stores items added to collection-valued properties. Exposes `keys`, `values`, and `count`.

### Class: `ObjectsRemovedFromCollectionProperties` (extends `Dictionary<string, ObjectList>`)

Stores items removed from collection-valued properties. Exposes `keys`, `values`, and `count`.

### Class: `ObjectList` (extends `List<any>`)

Serialisable list used internally by collection-change dictionaries. Exposes `count`.

---

## Usage Examples

### Tracking property changes

```typescript
import { ObjectChangeTracker, ObjectState, IObjectWithChangeTracker, ObjectWithChangeTrackerExtensions } from '@ca-webstack/change-tracker';

class Customer implements IObjectWithChangeTracker {
  changeTracker = new ObjectChangeTracker();
  private _name = '';

  get name() { return this._name; }
  set name(value: string) {
    this.changeTracker.recordOriginalValue('name', this._name);
    this._name = value;
  }
}

const customer = new Customer();
ObjectWithChangeTrackerExtensions.startTracking(customer);

customer.name = 'Acme Inc.';
console.log(customer.changeTracker.originalValues); // { name: '' }
console.log(customer.changeTracker.state);          // ObjectState.modified (via setter)
```

### Tracking collection changes

```typescript
import { TrackableCollectionFactory } from '@ca-webstack/change-tracker';

const items = TrackableCollectionFactory.getInstance<string>('a', 'b');
items.collectionChanged.subscribe(event => {
  console.log('Added:', event.newItems, 'Removed:', event.oldItems);
});

items.push('c'); // logs Added: ['c'], Removed: null
items.splice(0, 1); // logs Added: null, Removed: ['a']
```

### Recursive change tracking

```typescript
import { ObjectWithChangeTrackerExtensions } from '@ca-webstack/change-tracker';

// Enable tracking on an entity and all its nested trackable children
ObjectWithChangeTrackerExtensions.enableChangeTracking(rootEntity);

// Disable tracking recursively
ObjectWithChangeTrackerExtensions.disableChangeTracking(rootEntity);
```

### Accepting changes

```typescript
entity.changeTracker.acceptChanges(entity);
// State is reset to 'unchanged', original values and collection diffs are cleared.
// If `entity` is passed, nested tracked entities are also accepted recursively.
```
