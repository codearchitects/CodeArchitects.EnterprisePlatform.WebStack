# caep-ng-event-manager — API Documentation

## Why use this package

Provides Angular DI for `@ca-webstack/event-manager`’s `CustomEvent`-based pub/sub system. The service handles bulk registration/unregistration of `@CaepEvent`-decorated methods and imperative single-handler management.

---

## Features

- `CaepEventManagerModule` — NgModule with provider.
- `CaepEventManagerService` — injectable service.

---

## API Reference

### Service: `CaepEventManagerService`

`@Injectable()`

| Method | Signature | Description |
|---|---|---|
| `dispatch` | `(eventName: string, ...params: any[]) => void` | Fires a `CustomEvent` on `window`. |
| `registerEventListeners` | `(component: any) => void` | Walks the component's prototype chain, finds `@CaepEvent`-decorated methods, and registers `window` event listeners. Idempotent per instance. |
| `unregisterEventListeners` | `(component: any) => void` | Removes all event listeners registered for the given component. |
| `registerEventListener` | `(eventName: string, handler: Function, context?: any) => void` | Registers a single event listener. Optionally binds `this` via `context`. |
| `unregisterEventListener` | `(eventName: string, handler: Function) => void` | Removes a previously registered single event listener. |
