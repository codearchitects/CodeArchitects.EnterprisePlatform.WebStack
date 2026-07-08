/**
 * Represents arguments for notify collection changed event.
 */
export interface NotifyCollectionChangedEventArgs<T> {
  newItems: Array<T>;
  oldItems: Array<T>;
}
