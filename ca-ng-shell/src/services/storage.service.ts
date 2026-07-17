import { SerializerService } from '@ca-webstack/ng-serializer';
import { Injectable, Optional } from '@angular/core';
import { Activity } from '../components/activity';

/**
 * Storage keys key
 */
const SH_STORAGE_KEYS_KEY = 'sh-storage-keys';
/**
 * Storage type
 */
type SH_STORAGE_TYPE = 'Local' | 'Session' | 'Cookie';

@Injectable({
  providedIn: 'root'
})
export class ShStorageService {
  /**
   * Singleton
   */
  public static instance: ShStorageService = null;
  /**
   * Storage type
   */
  public storageType: SH_STORAGE_TYPE = 'Local';
  /**
   * Web Storage API
   */
  protected get storage(): Storage {
    switch (this.storageType) {
      case 'Local':
      default:
        return localStorage;
      case 'Session':
        return sessionStorage;
      case 'Cookie':
        return {
          getItem: this.getCookie.bind(this),
          setItem: this.setCookie.bind(this),
          removeItem: this.removeCookie.bind(this)
        } as Storage;
    }
  }
  /**
   * Storage holding keys
   */
  protected get keys(): string[] {
    return this.deserialize(this.storage.getItem(SH_STORAGE_KEYS_KEY)) || [];
  }
  protected set keys(value: string[]) {
    this.storage.setItem(SH_STORAGE_KEYS_KEY, this.serialize(value || []));
  }

  constructor(@Optional() private _serializer: SerializerService) {
    if (typeof (Storage) === undefined) {
      this.storageType = 'Cookie';
    }
    ShStorageService.instance = this;
  }

  public static initialize(serializer: SerializerService) {
    if (!ShStorageService.instance) {
      new ShStorageService(serializer);
    }
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   * @param key Storage unique key
   * @param value Key value
   */
  public setItem<T = any>(key: string, value: T) {
    try {
      this.storage.setItem(key, this.serialize(value));
      if (this.keys.indexOf(key) === -1) {
        this.keys = [...this.keys, key];
      }
    } catch (error) {
      if (error && error.name === 'QuotaExceededError') {
        this.clear();
      }
    }
  }

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   * @param key Storage unique key
   * @returns Key deserialized value
   */
  public getItem<T = any>(key: string): T | undefined {
    const serialized = this.storage.getItem(key);
    return this.deserialize(serialized);
  }

  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   * @param key Storage unique key
   */
  public removeItem(key: string): void {
    this.storage.removeItem(key);
    const keys = this.keys;
    const index = keys.indexOf(key);
    if (index > -1) {
      keys.splice(index, 1);
      this.keys = keys;
    }
  }

  /**
   * Removes all key/value pairs, if there are any.
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  public clear() {
    const taskId = Activity && Activity.CurrentPayload && Activity.CurrentPayload.taskId;
    this.keys.forEach(key => {
      if (key.indexOf(taskId) === -1) {
        this.removeItem(key);
      }
    });
    this.keys = [];
  }

  /**
   * Serializes an object
   * @param value Object to be serialized
   * @returns Serialized object
   */
  protected serialize<T = any>(value: T) {
    if (this._serializer) {
      return this._serializer.serialize(value);
    } else {
      return JSON.stringify(value);
    }
  }

  /**
   * Deserializes a string
   * @param value String to be deserialized
   * @returns Deserialized object
   */
  protected deserialize<T = any>(value: string) {
    if (this._serializer) {
      return value ? this._serializer.deserialize(value) : undefined;
    } else {
      return value ? JSON.parse(value) : undefined;
    }
  }

  /**
   * Sets a cookie
   * @param key Cookie unique key
   * @param value Key value
  */
  private setCookie<T = any>(key: string, value: T) {
    document.cookie = key + "=" + value + "; path=/";
  }

  /**
   * Returns the serialized cookie
   * @param key Cookie unique key
   * @returns Serialized cookie
   */
  private getCookie(key: string) {
    if (document.cookie.length > 0) {
      let startIndex = document.cookie.indexOf(key + "=");
      if (startIndex != -1) {
        startIndex = startIndex + key.length + 1;
        let endIndex = document.cookie.indexOf(";", startIndex);
        if (endIndex == -1) {
          endIndex = document.cookie.length;
        }
        return unescape(document.cookie.substring(startIndex, endIndex));
      }
    }
    return "";
  }

  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   * @param key Cookie unique key
   */
  private removeCookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
