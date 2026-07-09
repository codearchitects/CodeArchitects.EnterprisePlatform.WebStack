# ca-data-context

> `@ca-webstack/data-context` — Identity-map and unit-of-work pattern for TypeScript object graphs.

## Overview

This library provides a lightweight **DataContext** that recursively walks object graphs, deduplicates entities via an identity map, and applies pluggable merge strategies when the same entity is attached multiple times.

## Installation

```bash
npm install @ca-webstack/data-context
```

### Peer Dependencies

- `@ca-webstack/change-tracker` ~21.1.0
- `@ca-webstack/data-structures` ~21.1.0
- `@ca-webstack/reflection` ~21.1.0
- `core-js` ^3.41.0
- `lodash` ^4.17.21

## Quick Start

```typescript
import { Entity, DataContext, OverwriteAlwaysStrategy } from '@ca-webstack/data-context';

// 1. Decorate your model with @Entity
@Entity({ name: 'Customer', keys: 'id' })
class Customer {
  id: number;
  name: string;
}

// 2. Create a DataContext and attach entities
const ctx = new DataContext();
const customer = ctx.attach(customerFromServer);

// 3. Re-attach with a specific merge strategy
ctx.attach(updatedCustomer, new OverwriteAlwaysStrategy());
```

## Key Concepts

| Concept | Description |
|---|---|
| **`@Entity` decorator** | Marks a class with `name` and `keys` for identity tracking. |
| **`DataContext`** | Recursively attaches/detaches object graphs into an identity map. |
| **`IMergeStrategy`** | Interface for pluggable merge strategies when duplicates are found. |
| **`OverwriteAlwaysStrategy`** | Always overwrites old values with new ones (default). |
| **`IgnoreIfExistsStrategy`** | Keeps old values when the entity is already attached. |
| **`OverwriteIfNotChangedStrategy`** | Overwrites only if the entity's change tracker state is `unchanged`. |

## More Documentation

[Full API documentation](docs/index.md)
