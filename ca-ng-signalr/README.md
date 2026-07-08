# ca-ng-signalr

> `@ca-webstack/ng-signalr` — Angular SignalR integration with decorator-driven event handling and typed hub proxies.

## Overview

Provides Angular services for connecting to ASP.NET Core SignalR hubs. Features include a `@SignalREvent` decorator for declarative event subscription, typed `ShHubProxy` base class for hub abstraction, automatic serialization/deserialization via `@ca-webstack/reflection`, and connection lifecycle management with retry logic.

## Installation

```bash
npm install @ca-webstack/ng-signalr
```

### Peer Dependencies

- `@ca-webstack/change-tracker`, `@ca-webstack/data-context`, `@ca-webstack/data-structures`, `@ca-webstack/reflection` ~21.0.0
- `@ca-webstack/ng-data-context`, `@ca-webstack/ng-serializer` ~21.0.0
- `jquery` ^3.3.1

### Dependencies

- `@microsoft/signalr` 8.0.0

## Quick Start

```typescript
import { SignalRModule, SignalREvent, ShHubProxy } from '@ca-webstack/ng-signalr';

@NgModule({
  imports: [SignalRModule.forRoot({ hostUrl: 'https://api.example.com', connectionRetryCount: 3 })]
})
export class AppModule { }

// Define a hub proxy
class ChatHub extends ShHubProxy {
  public static readonly NAME = 'chatHub';
  public get hubName() {
    return ChatHub.NAME;
  }
}

// Use decorator for event subscription
class MyComponent {
  @SignalREvent({ hub: ChatHub, method: 'messageReceived' })
  onMessage(msg: string) { console.log(msg); }
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `SignalRModule` | NgModule with `forRoot()` static config. |
| `SignalRService` | Injectable service: `connect()`, `disconnect()`, `invoke()`, `subscribe()`. |
| `SignalRManager` | Static manager: connection lifecycle, event registration, retry logic. |
| `ShHubProxy` | Abstract base class for typed hub proxies with `joinGroup`/`leaveGroup`. |
| `@SignalREvent` | Decorator for declarative hub event subscriptions. |
| `SignalRLogger` | Colored console logger for debugging. |

## More Documentation

[Full API documentation](docs/index.md)
