# ca-ng-serializer

> `@ca-webstack/ng-serializer` — Angular wrapper for the reflection-based JSON serializer.

## Overview

A thin Angular wrapper around `@ca-webstack/reflection`'s `Serializer` class, providing `SerializerService` as an injectable Angular service.

## Installation

```bash
npm install @ca-webstack/ng-serializer
```

### Peer Dependencies

- `@ca-webstack/reflection` ~21.1.0
- `core-js` ^3.41.0

## Quick Start

```typescript
import { SerializerModule, SerializerService } from '@ca-webstack/ng-serializer';

// In your module:
@NgModule({ imports: [SerializerModule] })
export class AppModule { }

// In a service:
constructor(private serializer: SerializerService) { }

save(entity: any) {
  const json = this.serializer.serialize(entity);
}

load(json: string) {
  return this.serializer.deserialize(json);
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `SerializerModule` | NgModule providing `SerializerService`. |
| `SerializerService` | Injectable service wrapping `Serializer.serialize(value)` and `Serializer.deserialize(json)`. |

## More Documentation

[Full API documentation](docs/index.md)
