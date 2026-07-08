# ca-ng-command-dispatcher

> `@ca-webstack/ng-command-dispatcher` — Decorator-driven command dispatching for Angular.

## Overview

Provides a `@Command` decorator to annotate component methods as dispatchable commands, a `ShCommandComponent` base directive for automatic registration/unregistration, and a `CommandDispatcherService` that aggregates and executes commands across the application.

## Installation

```bash
npm install @ca-webstack/ng-command-dispatcher
```

### Peer Dependencies

- `@ca-webstack/reflection` ~21.0.0
- `core-js` ^3.41.0

## Quick Start

```typescript
import { ShCommandComponent, Command, ICommand } from '@ca-webstack/ng-command-dispatcher';

@Component({ selector: 'my-comp', template: '...' })
class MyComponent extends ShCommandComponent {
  @Command({ name: 'save', label: 'Save', iconClassName: 'fa-save' })
  onSave() { /* ... */ }
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `CommandDispatcherModule` | NgModule providing `CommandDispatcherService`. |
| `CommandDispatcherService` | Aggregates commands, emits changes, runs commands by name. |
| `ShCommandComponent` | Abstract base directive — auto-registers/unregisters on init/destroy. |
| `@Command` | Method decorator to define a dispatchable command. |
| `ICommand` | Command interface (name, label, caption, icon, visible, enabled, handler, etc.). |

## More Documentation

[Full API documentation](docs/index.md)
