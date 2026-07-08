# ca-ng-shell — API Documentation

## Why use this package

`@ca-webstack/ng-shell` provides the architectural foundation for enterprise Angular apps built with the Code Architects platform. It implements an **activity-based navigation model** where applications are structured as a hierarchy of Application → Domain → Scenario → Action, each with its own shell component, metadata decorators, and lifecycle hooks.

Key benefits:

- **Structured navigation** — `@Application`, `@Domain`, `@Task`, `@Action` decorators define the route hierarchy.
- **Self-tracking entities** — `Entity` and `EntityWithChangeTracker` base classes with property change notifications and navigation property fixups.
- **Activity management** — `Activity<TPayload>` manages process state, payload persistence, annotations, and stack-based navigation.
- **Shell components** — Abstract base classes for each level of the hierarchy with lifecycle hooks, guards, SignalR integration, and command dispatching.
- **HTTP & Storage** — `ShHttp` abstract HTTP client and `ShStorageService` for typed local/session/cookie storage.

---

## Features

- `Entity<TIdentifier>` — Abstract base entity with `INotifyPropertyChanged`, navigation property fixups.
- `EntityWithChangeTracker` — Entity with `ObjectChangeTracker` for change tracking.
- `EntityState` enum — `Ready`, `UpdatePending`, `Deleted`, `Disabled`.
- `Activity<TPayload>` — Activity/process management class.
- Shell components: `ApplicationShellComponent`, `DomainShellComponent`, `TaskShellComponent`, `ActionShellComponent`.
- `BaseShellComponent` — Common base with command dispatch, navigation, SignalR subscriptions.
- Decorators: `@Application`, `@Domain`, `@Task`, `@Action`.
- `getRoutesByTask` function for retrieving scenario layer's routes based on `ActionShellComponent` decorator's metadata.
- `RouteHelper` — Navigation helper.
- `ShHttp` — Abstract HTTP client with typed request methods.
- `ShStorageService` — Storage with serializer support.
- Lifecycle interfaces: `IOnInit`, `IOnDestroy`, `IOnChanges`, `IOnCanActivate`, `IOnCanDeactivate`, etc.

---

## Shell Component Hierarchy

```
ShCommandComponent (from ca-webstack/ng-command-dispatcher)
  └─ BaseShellComponent (abstract)
       ├─ ApplicationShellComponent (app-level, translations, microfrontend)
       ├─ DomainShellComponent (domain-level, title)
       └─ TaskShellComponent (task-level, payload lifecycle)

ShCommandComponent
  └─ ActionShellComponent (action-level, full lifecycle, guards)
```

---

## Entity Base Classes

### `Entity<TIdentifier>` (abstract)

- Implements `INotifyPropertyChanged`.
- `status: EntityState` — entity state.
- `id` (get/set) — identity property.
- `propertyChanged` — `Subject<PropertyChangedEventArgs>`.
- Protected helpers: `getProperty`, `setProperty`, `getOneNavProperty`, `setOneNavProperty`, `getManyNavProperty`, `setManyNavProperty`.
- Navigation fixup methods: `oneToOneFixup`, `oneToManyFixup`, `manyToOneFixup`, `manyToManyFixup`.

### `TrackableEntity<TIdentifier>` (extends Entity)

- Implements `IObjectWithChangeTracker`.
- `changeTracker: ObjectChangeTracker`.
- `rowVersion: Uint8Array`, `isDraft: boolean`.
- `acceptChanges()` — resets tracker.

---

## Activity Management

### `Activity<TPayload>`

- `taskId`, `payload`, `currentState`, `baseRoutePath`.
- `onSavePayload(payload)` / `onLoadPayload()` — abstract persistence hooks.
- `tryNavigateTo(precondition, action, newState)` — conditional navigation.
- `sleep()` / `wakeUp()` — suspend/resume activity.
- `setAnnotation()` / `getAnnotationByKey()` — process annotations.

---

## Storage

### `ShStorageService`

`@Injectable({ providedIn: 'root' })`

| Method | Description |
|---|---|
| `setItem(key, value)` | Store a value (serialized via `SerializerService`). |
| `getItem(key)` | Retrieve and deserialize a value. |
| `removeItem(key)` | Remove an item. |
| `clear()` | Clear all stored items. |
| `storageType` | `'Local'` \| `'Session'` \| `'Cookie'`. |
