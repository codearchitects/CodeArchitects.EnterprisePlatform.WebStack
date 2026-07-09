# ca-reflection

> `@ca-webstack/reflection` — Reflection, serialization, and decorator utilities for TypeScript.

## Overview

Provides a full-featured JSON serializer/deserializer driven by TypeScript decorators (`@JsonObject`, `@JsonProperty`, `@JsonIgnore`, `@Sealed`, `@Enumerable`), a metadata helper system, type activation, Base64 encoding, and type caching — forming the reflection backbone of the `@ca-webstack` ecosystem.

## Installation

```bash
npm install @ca-webstack/reflection
```

### Peer Dependencies

- `@ca-webstack/data-structures` ~21.1.0
- `core-js` ^3.41.0
- `tslib` ^2.3.0

## Quick Start

```typescript
import { JsonObject, JsonProperty, JsonIgnore, Serializer } from '@ca-webstack/reflection';

@JsonObject({ name: 'Person' })
class Person {
  @JsonProperty() firstName: string;
  @JsonProperty() lastName: string;
  @JsonIgnore() private _secret: string;
}

const json = Serializer.serialize(new Person());
const person = Serializer.deserialize<Person>(json);
```

## Key Exports

| Symbol | Description |
|---|---|
| `@JsonObject` | Class decorator for JSON serialization metadata. |
| `@JsonProperty` | Property decorator for serialization control and transformations. |
| `@JsonIgnore` | Property decorator to exclude from serialization. |
| `@Sealed` | Class decorator that seals constructor and prototype. |
| `@Enumerable` | Method/accessor decorator to set `enumerable` on a descriptor. |
| `Serializer` | Full JSON serializer/deserializer with type-aware round-tripping. |
| `Activator` | Creates instances by registered type name. |
| `Type` | Bidirectional name ↔ constructor registry. |
| `MetadataHelper` | Low-level decorator metadata extraction. |
| `btoa` / `atob` | Cross-platform Base64 encode/decode. |

## More Documentation

[Full API documentation](docs/index.md)
