# ca-ng-command-dispatcher — API Documentation

## Why use this package

`@ca-webstack/ng-command-dispatcher` implements the Command Pattern by decoupling command definitions from their UI representation. Components define commands through decorators or imperative APIs, while the `CommandDispatcherService` acts as the central invoker and aggregator — allowing toolbars, menus, and keyboard shortcuts to bind and react dynamically to the available commands.

---

## Features

- `@Command` method decorator with rich metadata (label, caption, icon, visibility, enabled state).
- `ShCommandComponent` abstract base class with auto-registration lifecycle.
- `CommandDispatcherService` — aggregates commands, emits `changes`, runs commands by name.
- Dynamic visibility/enabled resolution via property name strings.

---

## API Reference

### Decorator: `@Command(params: ICommandParams)`

Method decorator. Marks a component method as a dispatchable command.

```typescript
interface ICommandParams {
  name: string;              // Command identifier
  label?: any;               // Display label
  caption?: any;             // Tooltip/caption
  iconClassName?: any;       // CSS icon class
  htmlClassName?: string;    // CSS class on the HTML element
  visible?: boolean | string; // Visibility (string = property name on target)
  enabled?: boolean | string; // Enabled state (string = property name on target)
  resource?: string;         // Resource name
  family?: string;           // Command family/group
  properties?: { [key: string]: any };
}
```

---

### Interface: `ICommand`

Extends `ICommandParams` with `handler: Function`.

---

### Abstract Directive: `ShCommandComponent`

Base class for components that provide commands.

| Member | Description |
|---|---|
| `ngOnInit()` | Registers the component with `CommandDispatcherService`. |
| `ngOnDestroy()` | Unregisters the component. |
| `shCommands()` | Override to provide imperative commands (default: `[]`). |

---

### Service: `CommandDispatcherService`

| Member | Signature | Description |
|---|---|---|
| `changes` | `EventEmitter<ICommand[]>` | Emits aggregated command list on any change. |
| `add` | `(component: ShCommandComponent) => void` | Register a component's commands. |
| `remove` | `(component: ShCommandComponent) => void` | Unregister a component's commands. |
| `run` | `(commandName: string, ...params: any[]) => any` | Execute a command by name. |
| `apply` | `() => void` | Re-emit all commands (refresh). |

---

## Usage Example

```typescript
// Subscribe to command changes
commandDispatcher.changes.subscribe((commands: ICommand[]) => {
  this.toolbarCommands = commands;
});

// Run a command programmatically
commandDispatcher.run('save', myData);
```
