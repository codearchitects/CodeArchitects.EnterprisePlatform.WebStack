# ca-policy-engine — API Documentation

## Why use this package

`@ca-webstack/policy-engine` provides a flexible, claims-based authorization system. Define policies as JSON, load claims from your identity provider, and evaluate authorization rules at runtime — synchronously or reactively via RxJS.

Key benefits:

- **Declarative policies** — define authorization rules as JSON with AND/OR condition trees.
- **Resource wildcards** — match resources with `*` and `?` patterns (converted to RegExp).
- **Reactive evaluation** — `observePolicies()` re-emits whenever claims or policies change.
- **Extensible handlers** — register custom policy types via `RegisterHandler()`.
- **Well-known claim types** — `ClaimType` provides constants for standard claim URIs.

---

## Features

- `PolicyEngine` — core class with claims/policies management and evaluation.
- `ClaimType` — standard claim URI constants (role, email, group, tenant, language, etc.).
- `ClaimWrapper` — converts raw JSON claims to typed `IClaim[]`.
- `PolicyWrapper` / `PolicyWrapperHelper` — converts JSON policy config to typed `IPolicy[]`.
- Composite conditions: `IPolicyRuleLeaf`, `IPolicyRuleOrNode`, `IPolicyRuleAndNode`.
- Built-in `authorization` handler; `business` and `babel` handlers (currently inactive).

---

## API Reference

### Class: `PolicyEngine`

| Member | Signature | Description |
|---|---|---|
| `EnableCaching` (static) | `boolean` | Enable/disable policy result caching (default `true`). |
| `RegisterHandler` (static) | `(handler: IPolicyHandler) => void` | Register a custom policy type handler. |
| `GetPolicyHandler` (static) | `(type: string) => IPolicyHandler` | Retrieve handler by type. |
| `UnregisterHandler` (static) | `(handler: IPolicyHandler) => void` | Remove a handler. |
| `claims` | `IClaim[]` (get/set) | Current claims; triggers reactive re-evaluation. |
| `policies` | `IPolicy[]` (get/set) | Current policies; clears caches on set. |
| `context` | `any` (getter) | Constructor args context. |
| `data` | `any` (getter) | Additional context data. |
| `runPolicies` | `<T>(resource: string, ...selectors: string[]) => any` | Synchronously evaluates matching policies. |
| `runPoliciesWithContext` | `<T>(context: any, resource: string, ...selectors: string[]) => any` | Evaluates with a custom context. |
| `observePolicies` | `<T>(resource: string, ...selectors: string[]) => Observable<T>` | Returns an Observable that re-emits on claims/policy changes. |
| `checkCondition` | `(condition: IPolicyCondition, claims: IClaim[]) => boolean` | Recursively evaluates a condition tree against claims. |

---

### Class: `ClaimType`

Well-known claim URI constants:

| Property | URI |
|---|---|
| `email` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` |
| `name` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` |
| `role` | `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` |
| `nameIdentifier` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` |
| `group` | `http://schemas.xmlsoap.org/claims/Group` |
| `authenticationMethod` | `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod` |
| `authenticationInstant` | `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant` |
| `identityProvider` | `http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider` |
| `language` | `http://schemas.codearchitects.com/claims/language` |
| `tenant` | `http://schemas.codearchitects.com/claims/tenant` |
| `authenticated` | `http://schemas.codearchitects.com/claims/authenticated` |

---

### Interfaces

#### `IClaim`
```typescript
interface IClaim { type: string; value: string; }
```

#### `IPolicy` / `IBasePolicy` / `IAuthorizationPolicy`
```typescript
interface IBasePolicy {
  resource: RegExp;
  condition: IPolicyCondition;
  selector: string;
  [key: string]: any;
}
interface IAuthorizationPolicy extends IBasePolicy { type: 'authorization'; }
type IPolicy = IAuthorizationPolicy | IBasePolicy;
```

#### `IPolicyCondition`
```typescript
type IPolicyCondition = IPolicyRuleLeaf | IPolicyRuleOrNode | IPolicyRuleAndNode;

interface IPolicyRuleLeaf { claimType: string; claimValue: string; }
interface IPolicyRuleOrNode { or: IPolicyCondition[]; }
interface IPolicyRuleAndNode { and: IPolicyCondition[]; }
```

#### `IPolicyHandler`
```typescript
interface IPolicyHandler {
  type: string;
  handler: (policy: IPolicy, claims: IClaim[], context: Context) => any;
  createWrapHandler: () => IJsonPolicyWrapper;
}
```

---

### Class: `ClaimWrapper`

| Method | Signature | Description |
|---|---|---|
| `wrapJsonClaims` (static) | `(jsonClaims: IJsonClaim[]) => IClaim[]` | Converts raw JSON claims to typed `IClaim[]`. |

---

### Class: `PolicyWrapperHelper`

| Method | Signature | Description |
|---|---|---|
| `wrapJsonPolicies` (static) | `(jsonPolicies: IJsonPolicies) => IPolicy[]` | Converts a full JSON policy configuration into typed `IPolicy[]`. |

---

### Class: `Utility`

| Method | Signature | Description |
|---|---|---|
| `isLeafNode` (static) | `(node: any) => node is IPolicyRuleLeaf` | Type guard for leaf conditions. |
| `isOrNode` (static) | `(node: any) => node is IPolicyRuleOrNode` | Type guard for OR conditions. |
| `isAndNode` (static) | `(node: any) => node is IPolicyRuleAndNode` | Type guard for AND conditions. |

---

## Usage Examples

### Evaluating policies

```typescript
const engine = new PolicyEngine();
engine.claims = [{ type: ClaimType.role, value: 'admin' }];
engine.policies = [
  {
    resource: /^dashboard$/,
    type: 'authorization',
    selector: 'show',
    condition: { claimType: ClaimType.role, claimValue: 'admin' }
  }
];

const canView = engine.runPolicies('dashboard', 'show'); // true
```

### Reactive observation

```typescript
engine.observePolicies('dashboard', 'show').subscribe(result => {
  console.log('Authorization changed:', result);
});
// Re-emits whenever engine.claims or engine.policies are updated
```

### Loading from JSON config

```typescript
const policies = PolicyWrapperHelper.wrapJsonPolicies(serverConfig);
const claims = ClaimWrapper.wrapJsonClaims(jwtPayload.claims);
engine.policies = policies;
engine.claims = claims;
```
