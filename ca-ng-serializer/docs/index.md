# ca-ng-serializer — API Documentation

## Why use this package

Provides Angular DI for `@ca-webstack/reflection`'s `Serializer`. Instead of importing and using the static `Serializer` directly, inject `SerializerService` for better testability and consistency.

---

## Features

- `SerializerModule` — NgModule with `SerializerService` provider.
- `SerializerService` — injectable service with `serialize()` and `deserialize()`.

---

## API Reference

### Module: `SerializerModule`

```typescript
@NgModule({ providers: [SerializerService] })
export class SerializerModule { }
```

---

### Service: `SerializerService`

| Method | Signature | Description |
|---|---|---|
| `serialize` | `(value: any) => string` | Serializes an object to JSON string using `@ca-webstack/reflection`'s `Serializer`. |
| `deserialize` | `(json: string) => any` | Deserializes a JSON string back to a typed object. |

See `@ca-webstack/reflection` documentation for details on `@JsonObject`, `@JsonProperty`, and transformation support.
