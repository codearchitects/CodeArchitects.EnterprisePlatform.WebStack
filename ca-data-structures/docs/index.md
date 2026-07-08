# ca-data-structures — API Documentation

## Why use this package

`@ca-webstack/data-structures` fills gaps in the JavaScript standard library by providing .NET-inspired collections and value types. These structures are used throughout the `@ca-webstack` ecosystem and provide consistent, typed APIs for common operations.

---

## Features

- `List<T>` — indexed, strongly typed collection with rich manipulation API.
- `Dictionary<TKey, TValue>` — key-value store with duplicate detection.
- `DateOnly` — date without time component.
- `DateTime` — composite date + time with multiple constructor overloads.
- `DateTimeOffset` — date-time with timezone offset and ISO 8601 support.
- `DateRange` — start/end date pair.
- `TimeSpan` — time interval with arithmetic, parsing, and component accessors.
- `Ref<T>` / `IRef<T>` — pass-by-reference wrapper.

---

## API Reference

### Class: `List<T>`

Strongly typed list of objects accessible by index.

| Method | Signature | Description |
|---|---|---|
| `get` | `(index: number) => T` | Gets element at index. |
| `set` | `(index: number, item: T) => void` | Sets element at index. |
| `count` | `number` (getter) | Number of elements. |
| `add` | `(item: T) => void` | Appends an element. |
| `addRange` | `(collection: T[]) => void` | Appends multiple elements. |
| `clear` | `() => void` | Removes all elements. |
| `contains` | `(item: T) => boolean` | Checks if element exists. |
| `forEach` | `(action: (item: T) => void) => void` | Iterates all elements. |
| `indexOf` | `(item: T, index?: number) => number` | First index of element. |
| `insert` | `(index: number, item: T) => void` | Inserts at position. |
| `insertRange` | `(index: number, collection: T[]) => void` | Inserts multiple at position. |
| `lastIndexOf` | `(item: T, index?: number) => number` | Last index of element. |
| `remove` | `(item: T) => boolean` | Removes first occurrence. |
| `removeAt` | `(index: number) => void` | Removes at index. |
| `removeRange` | `(index: number, count: number) => void` | Removes a range. |
| `reverse` | `(index?: number, count?: number) => void` | Reverses in place. |
| `sort` | `(index?: number, count?: number) => void` | Sorts in place. |
| `toArray` | `() => T[]` | Returns a plain array copy. |

---

### Class: `Dictionary<TKey, TValue>`

Key-value collection.

| Method | Signature | Description |
|---|---|---|
| `get` | `(key: TKey) => TValue` | Gets value by key (throws if not found). |
| `set` | `(key: TKey, value: TValue) => void` | Adds or updates a key. |
| `keys` | `TKey[]` (getter) | Copy of all keys. |
| `values` | `TValue[]` (getter) | Copy of all values. |
| `count` | `number` (getter) | Number of entries. |
| `add` | `(key: TKey, value: TValue) => void` | Adds (throws on duplicate). |
| `clear` | `() => void` | Removes all entries. |
| `containsKey` | `(key: TKey) => boolean` | Checks if key exists. |
| `containsValue` | `(value: TValue) => boolean` | Checks if value exists. |
| `remove` | `(key: TKey) => boolean` | Removes by key. |

---

### Class: `DateOnly` (extends `Date`)

Represents a date without time. Use `toDateOnly(date)` to convert from a standard `Date`.

```typescript
function toDateOnly(date: Date): DateOnly
```

---

### Class: `DateTime`

Composite date + time value.

```typescript
// Constructor overloads
new DateTime()
new DateTime(value: DateTime)
new DateTime(value: Date)
new DateTime(value: string)
new DateTime(value: number)

// Properties
get date(): Date
set date(value: Date)
get time(): Date
set time(value: Date)

// Methods
valueOf(): number
toISOString(): string
toDate(): Date
```

---

### Class: `DateTimeOffset`

Date-time with timezone offset.

```typescript
constructor(dateTime: Date, offset: number)  // offset in minutes

static fromISO8601String(isoString: string): DateTimeOffset
toISO8601String(): string
```

---

### Class: `DateRange`

```typescript
constructor(_start?: Date, _end?: Date)
get start(): Date
set start(value: Date)
get end(): Date
set end(value: Date)
```

---

### Class: `TimeSpan`

Represents a time interval.

#### Static Constants

`MinValue`, `MaxValue`, `Zero`, `TicksPerMillisecond` (10000), `TicksPerSecond`, `TicksPerMinute`, `TicksPerHour`, `TicksPerDay`.

#### Static Factory Methods

| Method | Description |
|---|---|
| `fromDays(value)` | Creates from fractional days. |
| `fromHours(value)` | Creates from fractional hours. |
| `fromMinutes(value)` | Creates from fractional minutes. |
| `fromSeconds(value)` | Creates from fractional seconds. |
| `fromMilliseconds(value)` | Creates from fractional milliseconds. |
| `fromTicks(value)` | Creates from tick count. |
| `parse(s)` | Parses format `[-][d.]hh:mm[:ss[.fff]]`. |

#### Instance Properties (integer components)

`days`, `hours`, `minutes`, `seconds`, `milliseconds`

#### Instance Properties (fractional totals)

`totalDays`, `totalHours`, `totalMinutes`, `totalSeconds`, `totalMilliseconds`

#### Instance Methods

| Method | Signature | Description |
|---|---|---|
| `add` | `(ts: TimeSpan) => TimeSpan` | Adds two time spans. |
| `subtract` | `(ts: TimeSpan) => TimeSpan` | Subtracts a time span. |
| `compareTo` | `(ts: TimeSpan) => number` | Returns -1, 0, or 1. |
| `duration` | `() => TimeSpan` | Absolute value. |
| `equal` | `(ts: TimeSpan) => boolean` | Equality check. |
| `negate` | `() => TimeSpan` | Negates the interval. |
| `toString` | `() => string` | Format: `[-][d.]hh:mm:ss[.fff]`. |

---

### Class: `Ref<T>` / Interface: `IRef<T>`

Pass-by-reference wrapper supporting three modes:

```typescript
// ByVal
new Ref<string>('hello')

// ByRef (model + property)
new Ref(myObj, 'name')

// ByRef (getter/setter)
new Ref(() => val, (v) => val = v)

// Access
ref.value // get or set
```
