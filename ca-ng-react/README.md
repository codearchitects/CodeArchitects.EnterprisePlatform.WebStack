# ca-ng-react

> `@ca-webstack/ng-react` — Angular↔React bridge for embedding React components in Angular apps.

## Overview

A lightweight bridge that lets you render React components inside Angular applications. Provides `ShReactHostComponent` (selector `sh-react-component`) that mounts any React component class into the DOM, forwards props, and propagates state changes back to Angular via an `EventEmitter`.

## Installation

```bash
npm install @ca-webstack/ng-react
```

### Peer Dependencies

- `react` ^17.0.2
- `react-dom` ^17.0.2
- `@types/react` ^17.0.39
- `@types/react-dom` ^17.0.11

## Quick Start

```typescript
import { ShReactComponentsModule } from '@ca-webstack/ng-react';

@NgModule({ imports: [ShReactComponentsModule] })
export class AppModule { }
```

```html
<!-- In a template -->
<sh-react-component
  [component]="MyReactComponent"
  [props]="{ title: 'Hello' }"
  (changes)="onReactStateChange($event)">
</sh-react-component>
```

## Key Exports

| Symbol | Description |
|---|---|
| `ShReactComponentsModule` | NgModule declaring and exporting `ShReactHostComponent`. |
| `ShReactHostComponent` | Angular component (`sh-react-component`) that mounts a React component. Inputs: `component`, `props`, `debounceTime`, `throttleTime`. Output: `changes`. |
| `ShBaseReactComponent` | Abstract base class extending `React.Component`, which should be extended by the custom React component. |

## API

### `ShReactHostComponent`

| Input/Output | Type | Description |
|---|---|---|
| `@Input() component` | `any` | The React component class to render. |
| `@Input() props` | `any` | Props to pass to the React component. |
| `@Input() debounceTime` | `number` | Debounce time (ms) for state change emissions (default: 0). |
| `@Input() throttleTime` | `number` | Throttle time (ms) for state change emissions (default: 0). |
| `@Output() changes` | `EventEmitter` | Fires when the React component's state changes. |

### `ShBaseReactComponent`

Abstract class for React components that need to communicate state back to Angular.

| Member | Description |
|---|---|
| `change$` | `Subject<TState>` — emits on every `setState` call. |
| `element` | `ElementRef` — reference to the host DOM element. |
