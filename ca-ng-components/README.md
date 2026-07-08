# ca-ng-components

> `@ca-webstack/ng-components` — Comprehensive Angular UI component library.

## Overview

A rich Angular component library providing 40+ UI components built on a layered base class hierarchy. Includes form inputs (text, number, currency, date, select, multiselect, checkbox, radio, toggle, slider, mask), layout components (form, section, card, tabs, modal, grid), navigation (breadcrumb, toolbar, commands bar, sidebar), utilities (spinner, progress bar, timer, context menu, icon), and a full form state management system.

## Installation

```bash
npm install @ca-webstack/ng-components
```

### Key Peer Dependencies

- `@angular/core`, `@angular/forms`, `@angular/common`
- `@angular-architects/module-federation`
- `@ca-webstack/ng-aspects`, `@ca-webstack/ng-command-dispatcher`, `@ca-webstack/ng-i18n`, `@ca-webstack/ng-policy-engine`
- `@ca-webstack/data-structures`, `@ca-webstack/policy-engine`, `@ca-webstack/reflection`
- `@caep/event-manager`, `@caep/ng-event-manager`
- `@ngx-translate/core`, `@perfectmemory/ngx-contextmenu`, `@nodro7/angular-mydatepicker`
- `dompurify`, `jquery`, `lodash-es`, `ngx-countdown`, `ngx-mask`, `ngx-toastr`, `numeral`, `rxjs`

## Module Setup

```typescript
import { ShComponentsModule } from '@ca-webstack/ng-components';

@NgModule({
  imports: [ShComponentsModule]
})
export class AppModule { }
```

## Component Hierarchy

All components derive from a layered base class system:

```
ShBaseComponent<TOptions>
  └─ ShBaseAuthComponent<TOptions, TPolicies>
       └─ ShBaseModelComponent<T, O>
            ├─ ShBaseInputComponent<T, O>
            │    ├─ ShBaseFormattedComponent<T, O>
            │    ├─ ShBaseLookupSingleComponent<T, V, O>
            │    └─ ShBaseLookupMultiComponent<T, V, O>
            └─ ShBaseInputGroupComponent<T, O>
```

## Input Components

| Component | Selector | Description |
|---|---|---|
| `ShTextComponent` | `sh-text` | Text input |
| `ShTextareaComponent` | `sh-textarea` | Textarea |
| `ShNumericComponent` | `sh-number` | Number input |
| `ShCurrencyComponent` | `sh-currency` | Currency input |
| `ShPercentComponent` | `sh-percent` | Percent input |
| `ShMaskComponent` | `sh-mask` | Masked input |
| `ShDateComponent` | `sh-date` | Date picker |
| `ShDatetimeComponent` | `sh-datetime` | Date-time picker |
| `ShTimeComponent` | `sh-time` | Time picker |
| `ShCheckboxComponent` | `sh-checkbox` | Checkbox |
| `ShCheckgroupComponent` | `sh-checkgroup` | Checkbox group |
| `ShToggleComponent` | `sh-toggle` | Toggle switch |
| `ShRadioComponent` | `sh-radio` | Radio group |
| `ShSelectComponent` | `sh-select` | Select dropdown |
| `ShComboComponent` | `sh-combo` | Editable combobox |
| `ShMultiselectComponent` | `sh-multiselect` | Multi-select dropdown |
| `ShSliderComponent` | `sh-slider` | Range slider |

## Layout & Container Components

| Component | Selector | Description |
|---|---|---|
| `ShFormComponent` | `sh-form` | Form container |
| `ShFormGroupComponent` | `sh-form-group` | Form group |
| `ShFormArrayComponent` | `sh-form-array` | Form array |
| `ShSectionComponent` | `sh-section` | Collapsible section |
| `ShCardComponent` | `sh-card` | Card |
| `ShTabsComponent` | `sh-tabs` | Tab container |
| `ShModalComponent` | `sh-modal` | Modal dialog |
| `ShRowComponent` | `row` | Grid row |
| `ShColumnComponent` | `column` | Grid column |

## Navigation & Utility Components

| Component | Selector | Description |
|---|---|---|
| `ShToolbarComponent` | `sh-toolbar` | Toolbar |
| `ShCommandsBarComponent` | `sh-commands-bar` | Commands bar |
| `ShBreadcrumbComponent` | `sh-breadcrumb` | Breadcrumb |
| `ShSidebarComponent` | `sh-sidebar` | Sidebar navigation |
| `ShHeaderComponent` | `sh-header` | Page header |
| `ShSpinnerComponent` | `sh-spinner` | Loading spinner |
| `ShProgressBarComponent` | `sh-progress-bar` | Progress bar |
| `ShTimerComponent` | `sh-timer` | Countdown timer |
| `ShButtonComponent` | `sh-button` | Button |
| `ShCaptionComponent` | `sh-caption` | Caption |
| `ShIconComponent` | `sh-icon` | Icon display |
| `ShContextMenuComponent` | `sh-context-menu` | Context menu |

## Key Services

| Service | Description |
|---|---|
| `FormHandlerService` | Central form state: creates/manages `FormControl`, `FormGroup`, `FormArray`. |
| `ShToastService` | Toast notifications via `ngx-toastr`. |
| `AssetService` | HTTP asset loader with caching. |
| `NumberParsingService` | Locale-aware number parsing. |
| `TemplateMapperService` | Maps template names to component classes to support aspect programming from `ca-webstack/ng-aspects`. |

## SCSS Styles

The library exports SCSS partials for theming: `_colors.scss`, `_fonts.scss`, `_grid-system.scss`, `_mixins.scss`, `_input.scss`, `_common.scss`, `_icons.scss`, `_toast.scss`, and more under the `styles/` directory.

## Microfrontend Support

Includes `CaepMicrofrontendModule` and `CaepMicrofrontendComponent` for loading remote microfrontends via `@angular-architects/module-federation`, plus services for remote entry management, manifest loading, and translation propagation.
