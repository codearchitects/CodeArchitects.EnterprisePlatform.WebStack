# ca-ng-policy-engine

> `@ca-webstack/ng-policy-engine` — Angular wrapper for the claims-based policy engine.

## Overview

Provides `PolicyEngineService` (injectable wrapper around `@ca-webstack/policy-engine`), a `@Resource` decorator for annotating entities with resource URIs, and `ResourceService` for extracting that metadata.

## Installation

```bash
npm install @ca-webstack/ng-policy-engine
```

### Peer Dependencies

- `@ca-webstack/policy-engine` ~21.0.0
- `@ca-webstack/reflection` ~21.0.0
- `core-js` ^3.41.0

## Quick Start

```typescript
import { PolicyEngineService, Resource } from '@ca-webstack/ng-policy-engine';

@Resource({ uri: 'customers' })
class Customer { }

// In a service:
constructor(private policyEngine: PolicyEngineService) { }

check() {
  return this.policyEngine.runPolicies('customers', 'canEdit');
}
```

## Key Exports

| Symbol | Description |
|---|---|
| `PolicyEngineService` | Injectable wrapper: setClaims, setPolicies, runPolicies, observePolicies. |
| `@Resource` | Class/property decorator for resource URI metadata. |
| `ResourceService` | Service to extract `@Resource` metadata from entities. |

## More Documentation

[Full API documentation](docs/index.md)
