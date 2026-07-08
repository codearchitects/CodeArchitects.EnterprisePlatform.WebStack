# ca-ng-i18n — API Documentation

## Why use this package

`@ca-webstack/ng-i18n` adds a typed layer over `@ngx-translate` with the `Mstring` pattern — every translatable string carries both a translation key and a default fallback, ensuring your app never shows raw keys to users.

---

## Features

- `Mstring` interface for type-safe translatable strings.
- `I18nService` — extends `TranslateService` with `Mstring` support.
- `LocaleService` — reactive locale management.
- `I18nPipe` — use in templates: `{{ mstring | i18n }}`.
- `I18nModule` — with `forRoot()` / `forChild()` providers.

---

## API Reference

### Interface: `Mstring`

```typescript
interface Mstring {
  key: string;     // Translation key
  default: string; // Fallback value
}
```

---

### Service: `I18nService`

Implements `OnDestroy`. Wraps `TranslateService`.

| Method | Signature | Description |
|---|---|---|
| `get` | `(query: Mstring \| string, interpolateParams?: Object) => Observable<string>` | If `Mstring`, translates via key with default fallback. If plain string, returns `TranslateService.get()`. |

---

### Service: `LocaleService`

| Method | Signature | Description |
|---|---|---|
| `getLocale` | `() => Observable<string>` | Observable of the current locale. |
| `setLocale` | `(locale: string) => void` | Sets a new locale (skips if unchanged). |

---

### Pipe: `I18nPipe`

Template pipe for `Mstring` values.

```html
{{ { key: 'GREETING', default: 'Hello' } | i18n }}
```

---

### Module: `I18nModule`

| Method | Description |
|---|---|
| `forRoot()` | Provides `I18nService` and `LocaleService`. |
| `forChild()` | Same providers (for lazy-loaded modules). |
