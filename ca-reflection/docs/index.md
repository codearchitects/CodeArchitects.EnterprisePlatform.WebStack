# ca-reflection — API Documentation

## Why use this package

`@ca-webstack/reflection` provides the serialization and metadata layer for the entire `@ca-webstack` ecosystem. It enables decorator-driven JSON serialization with support for:

- Type-aware round-tripping (preserves `$type` metadata)
- Custom field transformations (rename, convert)
- Lifecycle hooks (`onSerializing`, `onSerialized`, `onDeserializing`, `onDeserialized`)
- Handling of `Date`, `DateTime`, `DateTimeOffset`, `TimeSpan`, `Guid`, `System.Byte[]` (Base64), `Dictionary`, `List`, and circular references (`$id`/`$ref`)

---

## Features

- **Decorators**: `@JsonObject`, `@JsonProperty`, `@JsonIgnore`, `@Sealed`, `@Enumerable`
- **Serializer**: full `serialize()` / `deserialize()` with type remapping, replacer, and option flags
- **Activator**: create instances by type name
- **Type**: bidirectional name ↔ constructor registry
- **MetadataHelper**: generic decorator metadata get/set utilities
- **Base64**: cross-platform `btoa` / `atob`

---

## API Reference

### Decorator: `@JsonObject<T>(args?: IJsonObjectArgs<T>)`

Class-level decorator for serialization. Registers the class in the type cache.

```typescript
interface IJsonObjectArgs<T> {
  name?: string;                           // Type name for $type metadata
  canSerialize?: boolean | ((obj?: T) => boolean);
  onSerializing?: (object: T) => void;
  onSerialized?: (object: T) => void;
  onDeserializing?: (object: T) => void;
  onDeserialized?: (object: T) => void;
  transformations?: ITransformation<any, any>[];
  convertTo?: (value: any) => any;
  convertFrom?: (value: any) => any;
  extends?: Function;
  debug?: boolean;
}
```

**Example:**
```typescript
@JsonObject({
  name: 'MyApp.Person',
  onDeserialized: (p) => console.log('deserialized', p)
})
class Person { }
```

---

### Decorator: `@JsonProperty<T>(args?: IJsonPropertyArgs<T>)`

Property/accessor decorator for per-field serialization control.

```typescript
interface IJsonPropertyArgs<T> {
  canSerialize?: boolean | ((obj?: T) => boolean);
  transformation?: ITransformation<any, any>;
}
```

**Example:**
```typescript
class Person {
  @JsonProperty({
    transformation: { name: 'first_name', convertTo: v => v, convertFrom: v => v }
  })
  get firstName() { return this._firstName; }
}
```

---

### Decorator: `@JsonIgnore()`

Shorthand for `@JsonProperty({ canSerialize: false })`.

---

### Decorator: `@Sealed`

Seals the constructor and prototype via `Object.seal()`.

---

### Decorator: `@Enumerable(value?: boolean)`

Sets the `enumerable` flag on a method/accessor descriptor. Defaults to `true`.

---

### Interface: `ITransformation<TSource, TTarget>`

```typescript
interface ITransformation<TSource, TTarget> {
  name?: string;            // Serialized field name
  originalName?: string;    // Set internally during deserialization
  namespace?: string;
  convertTo?: (value: TSource) => TTarget;   // Serialization transform
  convertFrom?: (value: TTarget) => TSource; // Deserialization transform
}
```

---

### Class: `Serializer`

Full-featured JSON serializer/deserializer.

| Member | Type | Description |
|---|---|---|
| `autoDeserializeDates` | `boolean` | Auto-convert ISO date strings to `Date` (default `true`). |
| `isSerializing` | `boolean` (static) | `true` while serialization is in progress. |
| `isDeserializing` | `boolean` (static) | `true` while deserialization is in progress. |
| `typeRemapper` | `{ [source: string]: string }` | Map type names during deserialization. |
| `serializeObservables` | `boolean` | Whether to include observables. |
| `serializeFunctions` | `boolean` | Whether to include functions. |
| `disableMetadata` | `boolean` | Skip decorator metadata processing. |

| Method | Signature | Description |
|---|---|---|
| `serialize` | `(obj: any) => string` | Serializes to JSON string. Handles `$type`, `$id`/`$ref`, all value types, transformations, and lifecycle hooks. |
| `deserialize` | `<T>(json: string) => T` | Deserializes from JSON string. Resolves `$type` via `Activator`, handles all value types and transformations. |

---

### Class: `Activator`

Creates instances from registered type names.

| Member | Signature | Description |
|---|---|---|
| `_prototypes` | `Map` | Manual prototype registry. |
| `createInstance` | `<T>(typeName: string, failIfNotFound?: boolean) => T` | Looks up type in `TypeCache` or `prototypes` and creates a new instance. |

---

### Class: `Type`

Bidirectional name ↔ constructor registry.

| Method | Signature | Description |
|---|---|---|
| `CacheTypes` | `(namespace: string, root?: any) => void` | Recursively registers all types under a namespace. |
| `getClassName` | `(target: any) => string` | Returns the class name of an instance or constructor. |
| `GetName` | `(object: any) => string \| null` | Returns the registered type name. |
| `CacheType` | `(name: string, ctor: any) => void` | Registers a single type. |

---

### Class: `MetadataHelper`

Low-level decorator metadata utilities using `Reflect.defineMetadata` / `Reflect.getMetadata`.

| Method | Signature | Description |
|---|---|---|
| `getMetadata` | `<T>(key: string, target: any, targetKey?: string, options?: IMetadataOptions) => T` | Gets metadata for a key, with optional parent chain traversal. |
| `defineMetadata` | `<TParams>(key: any, metadata: TParams, callback?: (target: any, targetKey: string, descriptor?: PropertyDescriptor) => TParams): (target: any, key?: string, descriptor?: PropertyDescriptor) => void` | Returns a decorato that stores metadata. |

---

### Functions: `btoa` / `atob`

Cross-platform Base64 encode/decode. Uses native browser APIs when available, falls back to a custom implementation for Node.js.
