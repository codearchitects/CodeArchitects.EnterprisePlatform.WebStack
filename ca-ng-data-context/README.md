# ca-ng-data-context

> `@ca-webstack/ng-data-context` — Angular wrapper for the DataContext identity-map service.

## Overview

A thin Angular wrapper around `@ca-webstack/data-context`, providing `DataContextService` as an injectable Angular service with `attach()` and `detach()` methods.

## Installation

```bash
npm install @ca-webstack/ng-data-context
```

### Peer Dependencies

- `@ca-webstack/change-tracker` ~21.0.0
- `@ca-webstack/data-context` ~21.0.0
- `@ca-webstack/data-structures` ~21.0.0
- `@ca-webstack/reflection` ~21.0.0

## Quick Start

```typescript
import { DataContextModule, DataContextService } from '@ca-webstack/ng-data-context';

// In your module:
@NgModule({ imports: [DataContextModule] })
export class AppModule { }

// In your component/service:
constructor(private dataContext: DataContextService) { }

load(data: Customer) {
  const entity = this.dataContext.attach(data);
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `DataContextModule` | NgModule providing `DataContextService`. |
| `DataContextService` | Injectable service wrapping `DataContext.attach()` and `detach()`. |

## More Documentation

[Full API documentation](docs/index.md)
