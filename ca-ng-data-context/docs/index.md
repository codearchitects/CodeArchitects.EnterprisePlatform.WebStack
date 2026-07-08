# ca-ng-data-context — API Documentation

## Why use this package

Provides Angular dependency injection for the `@ca-webstack/data-context` identity-map pattern. Instead of manually creating `DataContext` instances, inject `DataContextService` and let Angular manage the lifecycle.

---

## Features

- `DataContextModule` — NgModule with `DataContextService` provider.
- `DataContextService` — injectable wrapper with `attach()` and `detach()`.

---

## API Reference

### Module: `DataContextModule`

```typescript
@NgModule({ providers: [DataContextService] })
export class DataContextModule { }
```

---

### Service: `DataContextService`

| Method | Signature | Description |
|---|---|---|
| `attach` | `<T>(root: T, mergeStrategy?: IMergeStrategy) => T` | Attaches an entity graph to the internal identity map. |
| `detach` | `<T>(root: T) => void` | Removes an entity from the identity map. |

Both methods delegate directly to the underlying `DataContext` from `@ca-webstack/data-context`. See that library's documentation for details on merge strategies and the `@Entity` decorator.
