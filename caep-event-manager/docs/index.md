# caep-event-manager — API Documentation

## Why use this package

`@caep/event-manager` provides a simple, framework-agnostic pub/sub mechanism based on the browser's native `CustomEvent` API. It pairs well with `@caep/ng-event-manager` for Angular integration.

---

## Features

- `EventManager` — dispatches custom events via `window.dispatchEvent`.
- `@CaepEvent` — method decorator for event metadata via `reflect-metadata`.
- Zero framework dependencies.

---

## API Reference

### Class: `EventManager`

| Method | Signature | Description |
|---|---|---|
| `dispatch` | `(eventName: string, ...params: any[]) => void` | Creates a `CustomEvent` with `detail: params` and dispatches it on `window`. |

### Decorator: `@CaepEvent(args: ICaepEventArgs)`

Method decorator. Stores `ICaepEventMetadata` via `Reflect.defineMetadata` using key `CaepEventMetadataKey`.

### Interfaces

```typescript
interface ICaepEventArgs { name: string; }
interface ICaepEventMetadata { name: string; }
```

### Constants

```typescript
const CaepEventMetadataKey = 'custom:event';
```
