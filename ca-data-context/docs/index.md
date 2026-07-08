# ca-data-context — API Documentation

## Why use this package

`@ca-webstack/data-context` implements the **Identity Map** and **Unit of Work** patterns for TypeScript. When your application receives entity graphs from a server, the DataContext ensures that each entity (identified by its `@Entity` keys) exists only once in memory — subsequent attachments merge values according to a configurable strategy.

Key benefits:

- **Entity deduplication** — prevents multiple in-memory copies of the same server entity.
- **Pluggable merge strategies** — control how conflicts are resolved on re-attach.
- **Recursive graph walking** — automatically processes nested entities and arrays.
- **Integration with change tracking** — the `OverwriteIfNotChangedStrategy` respects `@ca-webstack/change-tracker` state.

---

## Features

- `@Entity` decorator with `name` and composite `keys` support.
- `DataContext` class with `attach()`, `detach()`, and `clear()`.
- Three built-in merge strategies: `OverwriteAlwaysStrategy`, `IgnoreIfExistsStrategy`, `OverwriteIfNotChangedStrategy`.
- `MergeStrategy` enum for strategy selection.
- `Context` class — low-level identity map backed by `Map`.

---

## API Reference

### Decorator: `@Entity(object: IEntityObject)`

Marks a class as a tracked entity.

```typescript
interface IEntityObject {
  name: string;            // Unique entity type name
  keys: string | string[]; // Property name(s) forming the identity key
}
```

#### Helper Functions

| Function | Signature | Description |
|---|---|---|
| `getEntity` | `(object: any) => IEntityObject` | Retrieves `@Entity` metadata from a class or instance. |
| `hasEntity` | `(object: any) => boolean` | Returns `true` if the target has `@Entity` metadata. |

---

### Class: `DataContext`

The main public service for managing entity graphs.

| Member | Signature | Description |
|---|---|---|
| `isAttaching` (static getter) | `boolean` | `true` while `attach()` is executing. |
| `attach` | `<T>(root: T, mergeStrategy?: IMergeStrategy) => T` | Recursively walks the object graph; attaches `@Entity`-decorated objects to the identity map. Returns the (potentially merged) root. |
| `detach` | `<T>(value: T) => void` | Removes an entity from the identity map. |
| `clear` | `() => void` | Empties the entire identity map. |

---

### Class: `Context`

Low-level identity map backed by `Map<string, any>`.

| Method | Signature | Description |
|---|---|---|
| `contains` | `<T>(object: T) => boolean` | Returns `true` if the entity is in the map. |
| `get` | `<T>(object: T) => any` | Returns the stored instance for the given entity key. |
| `set` | `<T>(object: T) => void` | Stores an entity in the map. |
| `remove` | `<T>(object: T) => void` | Removes an entity from the map. |
| `clear` | `() => void` | Clears the map. |

---

### Interface: `IMergeStrategy`

```typescript
interface IMergeStrategy {
  merge<T>(newVal: T, oldVal: T): T;
}
```

### Enum: `MergeStrategy`

| Member | Value | Description |
|---|---|---|
| `IgnoreIfAttached` | `0x1` | Keep old value if already attached. |
| `OverwriteAlways` | `0x2` | Always overwrite with new value (default). |
| `OverwriteIfNotChanged` | `0x4` | Overwrite only if change tracker state is `unchanged`. |
| `Default` | `OverwriteAlways` | Alias for `OverwriteAlways`. |

---

### Class: `OverwriteAlwaysStrategy`

Implements `IMergeStrategy`. Iterates all keys from both objects and copies values from `newVal` to `oldVal`. Default strategy.

### Class: `IgnoreIfExistsStrategy`

Implements `IMergeStrategy`. Returns `oldVal` if it exists, otherwise `newVal`.

### Class: `OverwriteIfNotChangedStrategy`

Implements `IMergeStrategy`. Only overwrites if `oldVal.changeTracker.state === ObjectState.unchanged`; otherwise returns `oldVal` unmodified. Requires `@ca-webstack/change-tracker`.

---

## Usage Examples

### Basic attach/detach

```typescript
import { Entity, DataContext } from '@ca-webstack/data-context';

@Entity({ name: 'Product', keys: 'id' })
class Product { id: number; name: string; price: number; }

const ctx = new DataContext();
const product = ctx.attach({ id: 1, name: 'Widget', price: 9.99 } as Product);

// Later, re-attaching merges by default (OverwriteAlways)
const updated = ctx.attach({ id: 1, name: 'Widget v2', price: 12.99 } as Product);

ctx.detach(product);
ctx.clear();
```

### Composite keys

```typescript
@Entity({ name: 'OrderLine', keys: ['orderId', 'lineNumber'] })
class OrderLine { orderId: number; lineNumber: number; qty: number; }
```

### Custom merge strategy

```typescript
import { IgnoreIfExistsStrategy } from '@ca-webstack/data-context';

// Keep existing values — useful when local edits should not be overwritten
ctx.attach(serverData, new IgnoreIfExistsStrategy());
```
