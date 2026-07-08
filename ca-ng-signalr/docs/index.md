# ca-ng-signalr — API Documentation

## Why use this package

`@ca-webstack/ng-signalr` provides a rich Angular integration layer for ASP.NET Core SignalR with:

- **Decorator-driven subscriptions** — `@SignalREvent` lets you annotate methods to auto-subscribe on connect.
- **Typed hub proxies** — `ShHubProxy` provides a typed interface for invoking hub methods and managing groups.
- **Automatic serialization** — messages are deserialized via `@ca-webstack/reflection`'s `Serializer` and optionally attached to the `DataContext`.
- **Connection management** — automatic retry logic, multi-context support, and lifecycle handling.

---

## Features

- `SignalRModule` with `forRoot()` configuration.
- `SignalRService` — injectable service for connect/disconnect/invoke/subscribe.
- `SignalRManager` — static singleton managing connections, events, retry.
- `ShHubProxy` — abstract typed hub proxy.
- `@SignalREvent` — method decorator for hub event subscriptions.
- `SignalRLogger` — colored console logging.
- Injection tokens: `HOST_URL`, `SIGNALR_ACCESS_TOKEN_FACTORY`, `CONNECTION_RETRY_COUNT`, `DISABLE_SERIALIZATION`, `DISABLE_DATA_CONTEXT`.

---

## API Reference

### Service: `SignalRService`

| Method | Signature | Description |
|---|---|---|
| `connect` | `<TContext>(context: TContext) => Promise<void>` | Connects context to its decorated hubs. |
| `disconnect` | `<TContext>(context: TContext) => Promise<void>` | Disconnects context from hubs. |
| `invoke` | `<THub, TParams>(hubName: string methodName: keyof THub, params: TParams) => Promise<void>` | Invokes a SignalR RPC. |
| `subscribe` | `<TParams>(hubName: string, methodName: string, callback: (args: TParams) => any) => Promise<() => void>` | Subscribes to a hub method; returns unsubscribe function. |

### Class: `ShHubProxy` (abstract)

| Member | Description |
|---|---|
| `static NAME` | Hub name constant. |
| `hubName` | Instance hub name. |
| `joinGroup(groupId: string)` | Joins a SignalR group. |
| `leaveGroup(groupId: string)` | Leaves a SignalR group. |
| `createHubMethod(methodName: string)` | Creates a typed method handle with `invoke`/`subscribe`/`unsubscribe`. |

### Decorator: `@SignalREvent<THub, TTarget>(params: ISignalREventArgs)`

```typescript
interface ISignalREventArgs<THub> {
  hub: THub;          // Hub proxy class
  method: keyof THub; // Method name to subscribe to
}
```

### Module: `SignalRModule`

```typescript
SignalRModule.forRoot({
  hostUrl: string,
  connectionRetryCount?: number,
  httpClient?: HttpClient,
  disableSerialization?: boolean, 
  disableDataContext?: boolean,
  accessTokenFactory?: () => string | Promise<string>
})
```
