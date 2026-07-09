# caep-ng-components

> `@ca-webstack/ng-components-extra` — Extended Angular component library with decorator-driven options, lifecycle hooks, pipes, and container layout system.

## Overview

Builds on top of `@ca-webstack/ng-components` with an enhanced component model featuring decorator-driven option coercion (`@CaepCoerceBoolean`, `@CaepCoerceNumber`, `@CaepCoerceCssPixel`, `@CaepCoerceArrayString`), a lifecycle hook system (`@CaepHook`) and a new full container layout system with side-menu and top-bar navigation.

## Installation

```bash
npm install @ca-webstack/ng-components-extra
```

### Key Peer Dependencies

- `@angular/core`, `@angular/common`
- `@ca-webstack/ng-aspects`, `@ca-webstack/ng-i18n`, `@ca-webstack/ng-policy-engine`, `@ca-webstack/ng-shell`
- `@ca-webstack/data-structures`, `@ca-webstack/reflection`, `@ca-webstack/policy-engine`
- `@ngx-translate/core`
- `lodash-es`, `jquery`, `rxjs`

## Key Exports

### Decorators

| Decorator | Description |
|---|---|
| `@CaepCoerceBoolean` | Coerces input to boolean. |
| `@CaepCoerceNumber` | Coerces input to number. |
| `@CaepCoerceCssPixel` | Coerces input to CSS pixel value. |
| `@CaepCoerceArrayString` | Coerces array to space-joined string. |
| `@CaepHook` | Lifecycle hook handler (avoids `super()` calls). |
| `@CaepOption` | Describes option with default value and coercion type. |
| `@CaepPipe` | Registers a pipe in the runtime pipe dictionary. |

### Components

Base hierarchy: `CaepBaseComponent` → `CaepBaseAuthComponent` → `CaepBaseModelComponent` → `CaepBaseInputComponent` → `CaepBaseFormattedComponent` / `CaepBaseLookupSingleComponent` / `CaepBaseLookupMultiComponent`.

Concrete components include: `CaepTextComponent`, `CaepContainerComponent`, `CaepSideMenuComponent`, `CaepSideMenuEntryComponent`, `CaepTopbarComponent`, `CaepTopbarItemComponent`, `CaepTopbarButtonComponent`.

### Services

| Service | Description |
|---|---|
| `CaepIdSequenceService` | Sequential ID generation. |
| `CaepFormHandlerService` | Central form state: creates/manages `FormControl`, `FormGroup`, `FormArray`. |
| `CaepTemplateMapperService` | Maps template names to component classes to support aspect programming from `ca-webstack/ng-aspects`. |
| `CaepSideMenuService` | Service for dynamic sidebar handling. |
| `CaepTopbarService` | Service for dynamic topbar handling. |

### Container Module

`CaepContainerModule` provides a full application shell with `CaepContainerComponent`, `CaepSideMenuService`, `CaepTopbarService`, side-menu navigation and top-bar commands.
