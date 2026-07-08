# ca-ng-policy-engine — API Documentation

## Why use this package

Provides Angular DI integration for `@ca-webstack/policy-engine`, plus a `@Resource` decorator so entity classes can declare their authorization resource name.

---

## Features

- `PolicyEngineService` — full injectable wrapper with reactive observables.
- `@Resource` — decorator for resource-level authorization metadata.
- `ResourceService` — extracts `@Resource` metadata at runtime.
---

## API Reference

### Service: `PolicyEngineService`

`@Injectable({ providedIn: 'root' })`

| Member | Signature | Description |
|---|---|---|
| `claims` (getter) | `IClaim[]` | Current claims. |
| `policies` (getter) | `IPolicy[]` | Current policies. |
| `context` (get/set) | `any` | Engine context; setting creates a new PolicyEngine. |
| `data` (getter) | `any` | Additional context data. |
| `isCacheEnabled` (get/set) | `boolean` | Toggle policy result caching. |
| `setClaims` | `(claims: IClaim[]) => void` | Set claims. |
| `resetClaims` | `() => void` | Clear all claims. |
| `setPolicies` | `(policies: IPolicy[]) => void` | Set typed policies. |
| `setJsonPolicies` | `(json: IJsonPolicies) => void` | Set policies from JSON config. |
| `setJsonClaims` | `(json: IJsonClaim[]) => void` | Set claims from JSON. |
| `resetPolicies` | `() => void` | Clear all policies. |
| `observePolicies` | `<T>(resource: string, ...selectors: string[]) => Observable<T>` | Reactive policy evaluation. |
| `runPolicies` | `<T>(resource: string, ...selectors: string[]) => any` | Synchronous evaluation. |
| `runPoliciesWithContext` | `<T>(ctx: any, resource: string, ...selectors: string[]) => any` | Evaluation with custom context. |

---

### Decorator: `@Resource(params: IResourceParams)`

```typescript
interface IResourceParams {
  uri: string; // Resource name for policy evaluation
}
```

---

### Service: `ResourceService`

`@Injectable({ providedIn: 'root' })`

| Method | Signature | Description |
|---|---|---|
| `getResource` | `(model: any, prop?: string) => IResourceParams` | Extracts `@Resource` metadata from class or property. |
