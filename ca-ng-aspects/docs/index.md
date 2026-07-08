# ca-ng-aspects — API Documentation

## Why use this package

`@ca-webstack/ng-aspects` brings a **declarative, decorator-driven approach** to Angular form metadata. Instead of scattering label text, validation rules, and display templates across component templates, you define them once on the model class and extract them at runtime.

Key benefits:

- **Single source of truth** — labels, validation rules, and warnings live on the model.
- **i18n integration** — labels and messages use `Mstring` (key + default) for translation via `@ngx-translate`.
- **Automatic FormControl creation** — `ValidatorHelper` builds Angular form controls pre-wired with sync and async validators.
- **Context-aware** — metadata can vary by context (e.g. `browse` vs `edit` views).

---

## Features

- `@Aspect` — attach label, template, and converter metadata to properties.
- `@Validation` — attach sync/async validation rules with translatable error messages.
- `@Warning` — attach non-blocking warning rules.
- `AspectsModule` — provides `AspectHelper` and `ContextService`.
- `AspectHelper` — extracts aspect metadata, labels, templates, and converters.
- `ValidatorHelper` — builds `FormControl` and `FormGroup` from metadata.
- `ContextService` — manages a reactive context state.

---

## API Reference

### Decorator: `@Aspect(params: IAspectParams)`

Property decorator. Attaches display metadata for different contexts (`browse`, `edit`, custom).

```typescript
interface IAspectParams {
  default: IAspectContext;  // Default context
  browse?: IAspectContext;  // Browse context
  edit?: IAspectContext;    // Edit context
}
```

```typescript
interface IAspectContext {
  label?: string | Mstring;       // Display label
  template?: string;              // Display template
  converters?: any | Array<any>;  // e.g Angular pipe
}
```

### Decorator: `@Validation(...params: IValidationParams[])`

Property or class decorator. Attaches validation rules.

```typescript
interface IValidationParams {
  validator: ValidatorFn | AsyncValidatorFn;          // Validator function (sync or async)
  async?: boolean;                                    // Whether the rule is async
  message: string | Mstring;                          // Error message or i18n key
  name?: string;                                      // Validation rule name
  condition?: (control: AbstractControl) => boolean;  // Conditional application
}
```

### Decorator: `@Warning(...params: IWarningParams[])`

Same shape as `@Validation` but for non-blocking warnings.

---

### Service: `AspectHelper`

Provided via `AspectsModule`.

| Method | Description |
|---|---|
| `getAspect(model: any, prop: string, context?: Context): IAspectParams` | Full aspect metadata for a property. |
| `getLabel(model: any, prop: string, context?: Context): string` | Label string (falls back to context). |
| `getTemplate(model: any, prop: string, context?: Context): string` | Template name. |
| `getConverters(model: any, prop: string, context?: Context): any \| Array<any>` | Converter pipe instances. |

---

### Service: `ValidatorHelper`

Tree-shakable singleton (`@Injectable({ providedIn: 'root' })`).

| Method | Description |
|---|---|
| `getValidation(model: any, prop?: string): IValidationParams[]` | Extract all validation metadata. |
| `getWarning(model: any, prop?: string): IWarningParams[]` | Extract all warning metadata. |
| `<T>getControl(model: any, prop: string): FormControl<T>` | Build a `FormControl` with validators. |
| `<T>getGroup(model: any): FormGroup<T>` | Build a `FormGroup` with class-level validators. |
| `getSyncValidators(model: any, prop?: string, compose?: boolean): ValidatorFn \| ValidatorFn[]` | Composed sync validators. |
| `getAsyncValidators(model: any, prop?: string, compose?: boolean): AsyncValidatorFn \| AsyncValidatorFn[]` | Composed async validators. |
| `getSyncWarnings(model: any, prop?: string, compose?: boolean): ValidatorFn \| ValidatorFn[]` | Composed warning validators. |
| `getAsyncWarnings(model: any, prop?: string, compose?: boolean): AsyncValidatorFn \| AsyncValidatorFn[]` | Composed async warning validators. |
| `getMessage(control: AbstractControl, error: string \| Mstring, model: any, prop?: string): string \| Mstring` | Get error message for a control. |
| `getWarningMessage(control: AbstractControl, warning: string \| Mstring, model: any, prop?: string): string \| Mstring` | Get warning message for a control. |

---

### Service: `ContextService`

Provided via `AspectsModule`.

| Member | Description |
|---|---|
| `contextChanged` | `EventEmitter` that emits on context changes. |
| `context` (get/set) | Current context value. |
| `enable()` | Enable context tracking. |
| `disable()` | Disable context tracking. |

---

### Enum: `Context`

| Member | Value |
|---|---|
| `browse` | `'browse'` |
| `edit` | `'edit'` |

---

## Usage Example

```typescript
import { Aspect, Validation, Warning, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { Validators } from '@angular/forms';

class Product {
  @Aspect({ default: { label: { key: 'PRODUCT.NAME', default: 'Name' }, template: 'sh-text' } })
  @Validation({ validator: Validators.required, message: { key: 'MANDATORY', default: 'Name mandatory' } })
  @Warning({ validator: Validators.maxLength(50), message: 'Name is quite long' })
  name: string;
}

// In a component:
const ctrl = validatorHelper.getControl(new Product(), 'name');
```
