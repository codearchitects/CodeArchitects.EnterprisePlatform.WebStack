/**
 * Represents a collection of keys and values.
 *
 * @param TKey - The type of the keys in the dictionary.
 * @param TValue - The type of the values in the dictionary.
 */
export class Dictionary<TKey, TValue> {
  private static ArgumentNull = 'Value cannot be null.';
  private static KeyNotPresent = 'The given key was not present in the dictionary.';
  private static KeyAlreadyAdded = 'An item with the same key has already been added.';

  protected _keys: TKey[] = [];
  protected _values: TValue[] = [];

  /**
   * Gets the value associated with the specified key.
   *
   * @param key - The key of the value to get or set.
   * @return The value associated with the specified key.
   * @throw Key is null.
   * @throw The property is retrieved and key does not exist in the collection.
   */
  public get(key: TKey): TValue {
    if (!key) {
      throw new Error(Dictionary.ArgumentNull);
    }

    var i = this._keys.indexOf(key);
    if (i === -1) {
      throw new Error(Dictionary.KeyNotPresent);
    }

    return this._values[i];
  }

  /**
   * Sets the value associated with the specified key. If the specified key is not found,
   * creates a new element with the specified key.
   *
   * @param key - The key of the value to get or set.
   * @param value - The value of the element to set. The value can be null for reference types.
   * @throw Key is null.
   */
  public set(key: TKey, value: TValue) {
    if (!key) {
      throw new Error(Dictionary.ArgumentNull);
    }

    var i = this._keys.indexOf(key);
    if (i === -1) {
      this.add(key, value);
    } else {
      this._values[i] = value;
    }
  }

  /**
   * Gets a collection containing the keys in the Dictionary<TKey, TValue>.
   *
   * @return A collection containing the keys in the Dictionary<TKey, TValue>.
   */
  public get keys() {
    return [...this._keys];
  }

  /**
   * Gets a collection containing the values in the Dictionary<TKey, TValue>.
   *
   * @return A collection containing the values in the Dictionary<TKey, TValue>.
   */
  public get values() {
    return [...this._values];
  }

  /**
   * Gets the number of key/value pairs contained in the Dictionary.
   *
   * @return The number of key/value pairs contained in the Dictionary.
   */
  public get count() {
    return this._keys.length;
  }

  /**
   * Adds the specified key and value to the dictionary.
   *
   * @param key - The key of the element to add.
   * @param value - The value of the element to add. The value can be null for reference types.
   * @throw Key is null.
   * @throw An element with the same key already exists in the Dictionary.
   */
  public add(key: TKey, value: TValue) {
    if (this._keys.indexOf(key) > -1) {
      throw new Error(Dictionary.KeyAlreadyAdded);
    }

    this._keys = [
      ...this._keys,
      key
    ];
    this._values = [
      ...this._values,
      value
    ];
  }

  /**
   * Removes all keys and values from the Dictionary.
   */
  public clear() {
    this._keys = [];
    this._values = [];
  }

  /**
   * Determines whether the Dictionary contains the specified key.
   *
   * @param key -  The key to locate in the Dictionary.
   * @return True if the Dictionary contains an element with the specified key; otherwise, false.
   * @throw Key is null.
   */
  public containsKey(key: TKey) {
    if (!key) {
      throw new Error(Dictionary.ArgumentNull);
    }
    return this._keys.indexOf(key) !== -1;
  }

  /**
   * Determines whether the Dictionary contains a specific value.
   *
   * @param value - The value to locate in the Dictionary. The value can be null for reference types.
   * @return True if the Dictionary contains an element with the specified value; otherwise, false.
   */
  public containsValue(value: TValue) {
    return this._values.indexOf(value) !== 1;
  }

  /**
   * Removes the value with the specified key from the Dictionary.
   *
   * @param key - The key of the element to remove.
   * @return True if the element is successfully found and removed; otherwise, false. This
   * method returns false if key is not found in the Dictionary.
   * @throw Key is null.
   */
  public remove(key: TKey) {
    if (!key) {
      throw new Error(Dictionary.ArgumentNull);
    }

    var i = this._keys.indexOf(key);
    if (i === -1) {
      return false;
    }

    this._keys = [
      ...this._keys.slice(0, i),
      ...this._keys.slice(i + 1)
    ];
    this._values = [
      ...this._values.slice(0, i),
      ...this._values.slice(i + 1)
    ];
    return true;
  }
}
