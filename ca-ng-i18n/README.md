# ca-ng-i18n

> `@ca-webstack/ng-i18n` — Internationalization utilities for Angular built on `@ngx-translate`.

## Overview

Provides an `I18nService` that wraps `@ngx-translate/core` with support for `Mstring` (key + default fallback), a `LocaleService` for reactive locale management, and an `I18nPipe` for template usage.

## Installation

```bash
npm install @ca-webstack/ng-i18n
```

### Peer Dependencies

- `@ngx-translate/core` ^15.0.0
- `core-js` ^3.41.0

## Quick Start

```typescript
import { I18nModule } from '@ca-webstack/ng-i18n';

@NgModule({ imports: [I18nModule.forRoot()] })
export class AppModule { }

// In templates:
// {{ { key: 'HELLO', default: 'Hello' } | i18n }}
```

## Key Exports

| Symbol | Description |
|---|---|
| `I18nModule` | NgModule with `forRoot()` / `forChild()` static methods. |
| `I18nService` | Wraps `TranslateService` — supports `Mstring` with fallback. |
| `LocaleService` | Reactive locale get/set via `BehaviorSubject`. |
| `I18nPipe` | Template pipe for translating `Mstring` values. |
| `Mstring` | Interface: `{ key: string; default: string }`. |

## More Documentation

[Full API documentation](docs/index.md)
