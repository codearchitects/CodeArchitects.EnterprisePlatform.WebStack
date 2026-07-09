# ca-event-manager

> `@ca-webstack/event-manager` — Lightweight, framework-agnostic event dispatching with a `@CaepEvent` decorator.

## Overview

Provides an `EventManager` class that dispatches `CustomEvent`s on the browser's `window` object, and a `@CaepEvent` method decorator that attaches event metadata via `Reflect.defineMetadata`.

## Installation

```bash
npm install @ca-webstack/event-manager
```

### Peer Dependencies

- `tslib` ^2.3.0

### Dependencies

- `reflect-metadata` ^0.1.13

## Quick Start

```typescript
import { EventManager, CaepEvent } from '@ca-webstack/event-manager';

class MyComponent {
  @CaepEvent({ name: 'onSave' })
  save() { /* ... */ }
}

// Dispatch an event
const em = new EventManager();
em.dispatch('onSave', { id: 1 });

// Listen (standard DOM)
window.addEventListener('onSave', (e: CustomEvent) => {
  console.log(e.detail); // [{ id: 1 }]
});
```

## Key Exports

| Symbol | Description |
|---|---|
| `EventManager` | Class with `dispatch(eventName, ...params)` — fires `CustomEvent` on `window`. |
| `@CaepEvent` | Method decorator attaching event metadata. |
| `ICaepEventArgs` | Interface: `{ name: string }`. |
| `ICaepEventMetadata` | Interface: `{ name: string }`. |
| `CaepEventMetadataKey` | Metadata key constant (`'custom:event'`). |

## More Documentation

[Full API documentation](docs/index.md)
