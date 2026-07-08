# ca-ng-aspects

> `@ca-webstack/ng-aspects` — Decorator-driven metadata for labels, validation, and warnings in Angular.

## Overview

Provides three decorators (`@Aspect`, `@Validation`, `@Warning`) to annotate entity properties with display metadata (labels, templates, converters) and validation rules (sync/async). An `AspectHelper` service extracts metadata at runtime, and a `ValidatorHelper` service builds Angular `FormControl` / `FormGroup` instances pre-wired with validators.

## Installation

```bash
npm install @ca-webstack/ng-aspects
```

### Peer Dependencies

- `@ca-webstack/ng-i18n` ~21.0.0
- `@ca-webstack/reflection` ~21.0.0
- `@ngx-translate/core` ^15.0.0

## Quick Start

```typescript
import { Aspect, Validation, Warning } from '@ca-webstack/ng-aspects';
import { Validators } from '@angular/forms';

class Customer {
  @Aspect({ default: { label: { key: 'CUSTOMER.NAME', default: 'Name' } } })
  @Validation({ validator: Validators.required, message: { key: 'ERRORS.REQUIRED', default: 'Required' } })
  name: string;
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `@Aspect` | Property decorator for labels, templates, and converter pipes. |
| `@Validation` | Property/class decorator for sync/async validators with messages. |
| `@Warning` | Property/class decorator for non-blocking warning validators. |
| `AspectsModule` | NgModule registering `AspectHelper` and `ContextService`. |
| `AspectHelper` | Service to extract aspect metadata from entities. |
| `ValidatorHelper` | Service to build `FormControl`/`FormGroup` from validation metadata. |
| `ContextService` | Observable context state management. |

## More Documentation

[Full API documentation](docs/index.md)
