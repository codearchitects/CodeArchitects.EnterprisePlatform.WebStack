# ca-ng-event-manager

> `@ca-webstack/ng-event-manager` — Angular wrapper for `@ca-webstack/event-manager`, providing DI-friendly event dispatching and decorator-based subscription.

## Overview

Provides `CaepEventManagerService` as an injectable Angular service that wraps the `@ca-webstack/event-manager` `EventManager`. Supports both decorator-based bulk registration (via `@CaepEvent` metadata) and imperative single-handler registration using `window` `CustomEvent`s.

## Installation

```bash
npm install @ca-webstack/ng-event-manager
```

### Peer Dependencies

- `@angular/common`, `@angular/core` ~21.2.0
- `@ca-webstack/event-manager` ~21.1.0
- `rxjs` ~7.8.1

## Quick Start

```typescript
import { CaepEventManagerModule, CaepEventManagerService } from '@ca-webstack/ng-event-manager';

@NgModule({ imports: [CaepEventManagerModule] })
export class AppModule { }

// In a component:
constructor(private eventManager: CaepEventManagerService) { }

ngOnInit() {
  this.eventManager.registerEventListeners(this);   // registers @CaepEvent-decorated methods
}

ngOnDestroy() {
  this.eventManager.unregisterEventListeners(this); // cleanup
}

fireEvent() {
  this.eventManager.dispatch('customEvent', { id: 1 });
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `CaepEventManagerModule` | NgModule providing `CaepEventManagerService`. |
| `CaepEventManagerService` | Injectable service: `dispatch`, `registerEventListeners`, `unregisterEventListeners`, `registerEventListener`, `unregisterEventListener`. |

## More Documentation

[Full API documentation](docs/index.md)
