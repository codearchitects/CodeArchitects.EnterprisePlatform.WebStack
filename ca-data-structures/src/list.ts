/**
 * Represents a strongly typed list of objects that can be accessed by index. Provides
 * methods to search, sort, and manipulate lists.
 *
 * @param T - The type of elements in the list.
 */
export class List<T> {
  private static IndexOutOfRange = 'Index was out of range. Must be non-negative and less than the size of the collection.';
  private static ArgumentNull = 'Value cannot be null.';
  private static RangeOutOfRange = 'Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.';
  private static NonNegativeNumber = 'Non-negative number required.';

  protected _collection: T[] = [];

  /**
   * Gets the element at the specified index.
   *
   * @param index - The zero-based index of the element to get.
   * @return The element at the specified index.
   * @throw Index is less than 0 or index is equal to or greater than List.count.
   */
  public get(index: number) {
    if (this.isOutOfRange(index)) {
      throw new Error(List.IndexOutOfRange);
    }
    return this._collection[index];
  }

  /**
   * Sets the element at the specified index.
   *
   * @param index - The zero-based index of the element to set.
   * @param item - The element to set.
   * @throw Index is less than 0.-or-index is equal to or greater than List.count.
   */
  public set(index: number, item: T) {
    if (this.isOutOfRange(index)) {
      throw new Error(List.IndexOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      item,
      ...this._collection.slice(index + 1)
    ];
  }

  /**
   * Gets the number of elements contained in the List.
   *
   * @return The number of elements contained in the List.
   */
  public get count() {
    return this._collection.length;
  }

  /**
   * Adds an object to the end of the List.
   *
   * @param item - The object to be added to the end of the List. The
   * value can be null for reference types.
   */
  public add(item: T) {
    this._collection = [...this._collection, item];
  }

  /**
   * Adds the elements of the specified collection to the end of the List.
   *
   * @param collection - The collection whose elements should be added to the end of the List.
   * The collection itself cannot be null, but it can contain elements that are null,
   * if type T is a reference type.
   * @throw Collection is null.
   */
  public addRange(collection: T[]) {
    if (!collection) {
      throw new Error(List.ArgumentNull);
    }
    this._collection = [...this._collection, ...collection];
  }

  /**
   * Removes all elements from the List.
   */
  public clear() {
    this._collection = [];
  }

  /**
   * Determines whether an element is in the List.
   *
   * @param item - The object to locate in the List. The value can be null for reference types.
   * @return True if item is found in the List; otherwise, false.
   */
  public contains(item: T) {
    return this._collection.indexOf(item) !== -1;
  }

  /**
   * Performs the specified action on each element of the List.
   *
   * @param action - The action delegate to perform on each element of the List.
   * @throw Action is null.
   */
  public forEach(action: (item: T) => void) {
    if (!action) {
      throw new Error(List.ArgumentNull);
    }
    this._collection.forEach(item => action(item));
  }

  /**
   * Searches for the specified object and returns the zero-based index of the first occurrence within
   * the range of elements in the List that extends from the specified index to the last element.
   *
   * @param item - The object to locate in the List. The value can be null for reference types.
   * @param index - The zero-based starting index of the search. 0 (zero) is valid in an empty list.
   * @return The zero-based index of the first occurrence of item within the range of elements
   * in the List that extends from index to the last element, if found; otherwise, –1.
   * @throw Index is outside the range of valid indexes for the List.
   */
  public indexOf(item: T, index: number = 0) {
    if (this.isOutOfRange(index, false)) {
      throw new Error(List.IndexOutOfRange);
    }
    return this._collection.indexOf(item, index);
  }

  /**
   * Inserts an element into the List at the specified index.
   *
   * @param index - The zero-based index at which item should be inserted.
   * @param item - The object to insert. The value can be null for reference types.
   * @throw Index is less than 0 or index is greater than List.count.
   */
  public insert(index: number, item: T) {
    if (this.isOutOfRange(index, false)) {
      throw new Error(List.IndexOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      item,
      ...this._collection.slice(index)
    ];
  }

  /**
   * Inserts the elements of a collection into the List at the specified index.
   *
   * @param index - The zero-based index at which the new elements should be inserted.
   * @param collection - The collection whose elements should be inserted into the List.
   * The collection itself cannot be null, but it can contain elements that are null, if type T is a reference type.
   * @throw Collection is null.
   * @throw Index is less than 0 or index is greater than List.count.
   */
  public insertRange(index: number, collection: T[]) {
    if (!collection) {
      throw new Error(List.ArgumentNull);
    }
    if (this.isOutOfRange(index, false)) {
      throw new Error(List.IndexOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      ...collection,
      ...this._collection.slice(index)
    ];
  }

  /**
   * Searches for the specified object and returns the zero-based index of the last occurrence within
   * the range of elements in the List that extends from the first element to the specified index.
   *
   * @param item - The object to locate in the List. The value can be null for reference types.
   * @param index - The zero-based starting index of the backward search.
   * @return The zero-based index of the last occurrence of item within the range of elements
   * in the List that extends from the first element to index, if found; otherwise, –1.
   * @throw Index is outside the range of valid indexes for the List.
   */
  public lastIndexOf(item: T, index: number = this.count) {
    if (this.isOutOfRange(index, false)) {
      throw new Error(List.IndexOutOfRange);
    }
    return this._collection.lastIndexOf(item, index);
  }

  /**
   * Removes the first occurrence of a specific object from the List.
   *
   * @param item -  The object to remove from the List. The value can be null for reference types.
   * @return True if item is successfully removed; otherwise, false. This method also returns
   * false if item was not found in the List.
   */
  public remove(item: T) {
    var count = this.count;
    this._collection = this._collection.filter(i => i !== item);
    return this.count !== count;
  }

  /**
   * Removes the element at the specified index of the List.
   *
   * @param index - The zero-based index of the element to remove.
   * @throw Index is less than 0 or index is equal to or greater than List.count.
   */
  public removeAt(index: number) {
    if (this.isOutOfRange(index)) {
      throw new Error(List.IndexOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      ...this._collection.slice(index + 1)
    ];
  }

  /**
   * Removes a range of elements from the List.
   *
   * @param index - The zero-based starting index of the range of elements to remove.
   * @param count - The number of elements to remove.
   * @throw Index is less than 0 or count is less than 0.
   * @throw Index and count do not denote a valid range of elements in the List.
   */
  public removeRange(index: number, count: number) {
    if (count < 0) {
      throw new Error(List.NonNegativeNumber);
    }
    if (this.isOutOfRange(index) || this.isOutOfRange(index + count - 1)) {
      throw new Error(List.RangeOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      ...this._collection.slice(index + count)
    ];
  }

  /**
   * Reverses the order of the elements in the specified range.
   *
   * @param index - The zero-based starting index of the range to reverse.
   * @param count - The number of elements in the range to reverse.
   * @throw Index is less than 0 or count is less than 0.
   * @throw Index and count do not denote a valid range of elements in the List.
   */
  public reverse(index: number = 0, count: number = this.count) {
    if (count < 0) {
      throw new Error(List.NonNegativeNumber);
    }
    if (this.isOutOfRange(index) || this.isOutOfRange(index + count - 1)) {
      throw new Error(List.RangeOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      ...this._collection.slice(index, index + count).reverse(),
      ...this._collection.slice(index + count)
    ];
  }

  /**
   * Sorts the elements in a range of elements in List.
   *
   * @param index - The zero-based starting index of the range to sort.
   * @param count - The number of elements in the range to sort.
   * @throw Index is less than 0 or count is less than 0.
   * @throw Index and count do not denote a valid range of elements in the List.
   */
  public sort(index: number = 0, count: number = this.count) {
    if (count < 0) {
      throw new Error(List.NonNegativeNumber);
    }
    if (this.isOutOfRange(index) || this.isOutOfRange(index + count - 1)) {
      throw new Error(List.RangeOutOfRange);
    }
    this._collection = [
      ...this._collection.slice(0, index),
      ...this._collection.slice(index, index + count).sort(),
      ...this._collection.slice(index + count)
    ];
  }

  /**
   * Copies the elements of the List to a new array.
   *
   * @return An array containing copies of the elements of the List.
   */
  public toArray() {
    return [...this._collection];
  }

  private isOutOfRange(index: number, strict: boolean = true) {
    if (strict) {
      return index < 0 || index >= this.count;
    } else {
      return index < 0 || index > this.count;
    }
  }
}
