# ca-ng-shell

> `@ca-webstack/ng-shell` — Application shell framework for Angular, providing activity-based navigation, task/process management, entity base classes, and SignalR integration.

## Overview

Provides the architectural backbone for enterprise Angular applications: an activity/task/action navigation model, self-tracking entity base classes (`Entity`, `EntityWithChangeTracker`), shell component hierarchy (`ApplicationShellComponent`, `DomainShellComponent`, `TaskShellComponent`, `ActionShellComponent`), HTTP abstraction (`ShHttp`), storage service, route guards, and decorator-driven metadata (`@Application`, `@Domain`, `@Task`, `@Action`).

## Installation

```bash
npm install @ca-webstack/ng-shell
```

### Key Peer Dependencies

- `@angular/core`, `@angular/common`, `@angular/router`
- `@ca-webstack/ng-components`, `@ca-webstack/ng-aspects`, `@ca-webstack/ng-command-dispatcher`, `@ca-webstack/ng-data-context`
- `@ca-webstack/ng-i18n`, `@ca-webstack/ng-policy-engine`, `@ca-webstack/ng-serializer`, `@ca-webstack/ng-signalr`
- `@ca-webstack/change-tracker`, `@ca-webstack/data-context`, `@ca-webstack/data-structures`, `@ca-webstack/reflection`
- `@ca-webstack/policy-engine`
- `@ca-webstack/event-manager`, `@ca-webstack/ng-event-manager`
- `@microsoft/signalr`

## Key Exports

| Symbol | Description |
|---|---|
| `Entity<TIdentifier>` | Abstract base entity with property change notifications and navigation property fixups. |
| `TrackableEntity<TIdentifier>` | Extends `Entity` with `ObjectChangeTracker` integration. |
| `Activity<TPayload>` | Process activity management with navigation, save/load, sleep/wakeUp. |
| `ApplicationShellComponent` | Abstract app-level shell with translation sync and microfrontend support. |
| `DomainShellComponent` | Abstract domain-level shell with title management. |
| `TaskShellComponent` | Abstract task-level shell with payload lifecycle. |
| `ActionShellComponent` | Abstract action-level shell with full lifecycle hooks, guards, and SignalR. |
| `@Application`, `@Domain`, `@Task`, `@Action` | Route metadata decorators. |
| `getRoutesByTask` | Utility function for retrieving scenario layer's routes based on `ActionShellComponent` decorator's metadata. |
| `ShHttp` | Abstract HTTP client. |
| `ShStorageService` | Local/Session/Cookie storage with serialization. |
| `RouteHelper` | Navigation helper. |

## More Documentation

[Full API documentation](docs/index.md)
