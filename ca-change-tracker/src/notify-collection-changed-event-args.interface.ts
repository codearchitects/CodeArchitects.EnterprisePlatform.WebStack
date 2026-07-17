/**
 * Represents arguments for notify collection changed event.
 */
export interface NotifyCollectionChangedEventArgs<T> { // FIXME: Setup generics on server
  newItems: Array<T>;
  oldItems: Array<T>;
}
