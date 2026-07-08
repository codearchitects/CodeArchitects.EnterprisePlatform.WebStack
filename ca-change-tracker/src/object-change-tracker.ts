import { Serializer, JsonObject, JsonProperty, JsonIgnore, Enumerable } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import { ObjectStateChangingEventArgs } from './object-state-changing-event-args';
import { ObjectState } from './object-state';
import { OriginalValuesDictionary } from './original-values-dictionary';
import { ExtendedPropertiesDictionary } from './extended-properties-dictionary';
import { ObjectsAddedToCollectionProperties } from './objects-added-to-collection-properties';
import { ObjectsRemovedFromCollectionProperties } from './objects-removed-from-collection-properties';
import { DictionaryUtils } from './dictionary-utils';
import { ObjectList } from './object-list';

/**
 * Helper class that captures most of the change tracking work that needs to be done on SelfTracking Entities.
 */
@JsonObject({
  name: 'CodeArchitects.Data.ObjectChangeTracker, CodeArchitects.Data'
})
export class ObjectChangeTracker {

  //#region Events
  @JsonIgnore() private _objectStateChanging: Subject<ObjectStateChangingEventArgs>;

  /**
   * Emit an event on object state changing on SelfTracking Entities.
   *
   * @return Object state changing event emitter.
   *
   * ### Example
   * ```
   * entity.objectStateChanging
   *   .subscribe([object-state-changing-cb]);
   * ```
   */
  @JsonIgnore()
  public get objectStateChanging() {
    if (!this._objectStateChanging) {
      this._objectStateChanging = new Subject<ObjectStateChangingEventArgs>();
    }
    return this._objectStateChanging;
  }

  //#region Events

  @JsonIgnore() public objectStateChangingFn: (args: ObjectStateChangingEventArgs) => any;

  //#endregion

  //#region Fields

  @JsonIgnore() private _objectState: ObjectState = ObjectState.unchanged;
  @JsonIgnore() private _changeTrackingEnabled: boolean = false;
  @JsonIgnore() private _originalValues: OriginalValuesDictionary;
  @JsonIgnore() private _extendedProperties: ExtendedPropertiesDictionary;
  @JsonIgnore() private _objectsAddedToCollectionProperties: ObjectsAddedToCollectionProperties;
  @JsonIgnore() private _objectsRemovedFromCollectionProperties: ObjectsRemovedFromCollectionProperties;

  //#endregion

  protected onObjectStateChanging(newState: ObjectState) {
    if (this.objectStateChangingFn) {
      this.objectStateChangingFn({ newState });
    }
    if (!this.objectStateChanging) {
      this.objectStateChanging.next({ newState: newState });
    }
  }

  /**
   * Get the object state on SelfTracking Entities.
   *
   * @return Object state.
   */
  @Enumerable()
  public get state(): ObjectState { return this._objectState; }
  /**
   * Set the object state on SelfTracking Entities.
   *
   * @param value - Object state.
   */
  public set state(value: ObjectState) {
    if (Serializer.isDeserializing || this._changeTrackingEnabled) {
      this.onObjectStateChanging(value);
      this._objectState = value;
    }
  }

  /**
   * Get the change tracking enabled flag on SelfTracking Entities.
   *
   * @return Change tracking enabled flag.
   */
  @Enumerable()
  public get changeTrackingEnabled(): boolean { return this._changeTrackingEnabled; }
  /**
   * Set the change tracking enabled flag on SelfTracking Entities.
   *
   * @param value - Change tracking enabled flag.
   */
  public set changeTrackingEnabled(value: boolean) { this._changeTrackingEnabled = value; }

  /**
   * Get a dictionary of original values for all properties that was changed on SelfTracking Entities.
   *
   * @return Dictionary of original values.
   */
  @JsonProperty({
    transformation: {
      name: 'originalValues',
      convertTo: (dic) => DictionaryUtils.convertDicToObj(OriginalValuesDictionary, dic),
      convertFrom: (obj) => DictionaryUtils.convertObjToDic(OriginalValuesDictionary, obj)
    }
  })
  @Enumerable()
  public get originalValues(): OriginalValuesDictionary {
    if (!this._originalValues) {
      this._originalValues = new OriginalValuesDictionary();
    }
    return this._originalValues;
  }
  public set originalValues(value: OriginalValuesDictionary) {
    if (Serializer.isDeserializing) {
      this._originalValues = value;
    } else {
      throw new TypeError('Cannot set property originalValues of #<ObjectChangeTracker> which has only a getter');
    }
  }

  @JsonProperty({
    transformation: {
      name: 'extendedProperties',
      convertTo: (dic) => DictionaryUtils.convertDicToObj(ExtendedPropertiesDictionary, dic),
      convertFrom: (obj) => DictionaryUtils.convertObjToDic(ExtendedPropertiesDictionary, obj)
    }
  })
  @Enumerable()
  public get extendedProperties(): ExtendedPropertiesDictionary {
    if (!this._extendedProperties) {
      this._extendedProperties = new ExtendedPropertiesDictionary();
    }
    return this._extendedProperties;
  }
  public set extendedProperties(value: ExtendedPropertiesDictionary) {
    if (Serializer.isDeserializing) {
      this._extendedProperties = value;
    } else {
      throw new TypeError('Cannot set property extendedProperties of #<ObjectChangeTracker> which has only a getter');
    }
  }

  /**
   * Get a dictionary of values added to collection properties on SelfTracking Entities.
   *
   * @return Dictionary of added values.
   */
  @JsonProperty({
    transformation: {
      name: 'objectsAddedToCollectionProperties',
      convertTo: (dic) => DictionaryUtils.convertDicToObj(ObjectsAddedToCollectionProperties, dic),
      convertFrom: (obj) => DictionaryUtils.convertObjToDic(ObjectsAddedToCollectionProperties, obj)
    }
  })
  @Enumerable()
  public get objectsAddedToCollectionProperties(): ObjectsAddedToCollectionProperties {
    if (!this._objectsAddedToCollectionProperties) {
      this._objectsAddedToCollectionProperties = new ObjectsAddedToCollectionProperties();
    }
    return this._objectsAddedToCollectionProperties;
  }
  public set objectsAddedToCollectionProperties(value: ObjectsAddedToCollectionProperties) {
    if (Serializer.isDeserializing) {
      if (value) { // if array is passed then map to objectlist with same content
        value['_values'] = value.values.map(i => {
          if (Array.isArray(i)) {
            const retval = new ObjectList();
            retval.addRange(i);
            return retval;
          }
          return i;
        });
      }
      this._objectsAddedToCollectionProperties = value;
    } else {
      throw new TypeError('Cannot set property objectsAddedToCollectionProperties of #<ObjectChangeTracker> which has only a getter');
    }
  }

  /**
   * Get a dictionary of values removed from collection properties on SelfTracking Entities.
   *
   * @return Dictionary of removed values.
   */
  @JsonProperty({
    transformation: {
      name: 'objectsRemovedFromCollectionProperties',
      convertTo: (dic) => DictionaryUtils.convertDicToObj(ObjectsRemovedFromCollectionProperties, dic),
      convertFrom: (obj) => DictionaryUtils.convertObjToDic(ObjectsRemovedFromCollectionProperties, obj)
    }
  })
  @Enumerable()
  public get objectsRemovedFromCollectionProperties(): ObjectsRemovedFromCollectionProperties {
    if (!this._objectsRemovedFromCollectionProperties) {
      this._objectsRemovedFromCollectionProperties = new ObjectsRemovedFromCollectionProperties();
    }
    return this._objectsRemovedFromCollectionProperties;
  }
  public set objectsRemovedFromCollectionProperties(value: ObjectsRemovedFromCollectionProperties) {
    if (Serializer.isDeserializing) {
      if (value) { // if array is passed then map to objectlist with same content
        value['_values'] = value.values.map(i => {
          if (Array.isArray(i)) {
            const retval = new ObjectList();
            retval.addRange(i);
            return retval;
          }
          return i;
        });
      }
      this._objectsRemovedFromCollectionProperties = value;
    } else {
      throw new TypeError('Cannot set property objectsRemovedFromCollectionProperties of #<ObjectChangeTracker> which has only a getter');
    }
  }

  //#region MethodsForChangeTrackingOnClient

  /**
   * Resets the ObjectChangeTracker to the Unchanged state and
   * clears the original values as well as the record of changes
   * to collection properties.
   */
  public acceptChanges(entity?: any) {
    // if (this.changeTrackingEnabled) {
    this.onObjectStateChanging(ObjectState.unchanged);
    this.originalValues.clear();
    this.objectsAddedToCollectionProperties.clear();
    this.objectsRemovedFromCollectionProperties.clear();
    this.changeTrackingEnabled = true;
    this._objectState = ObjectState.unchanged;
    if (entity) {
      for (const key in entity) {
        const field = entity[key];
        if (Array.isArray(field)) {
          field.forEach(f => {
            if (typeof f === 'object' && !!f?.changeTracker) {
              f.changeTracker.acceptChanges(f);
            }
          })
        }
        if (typeof field === 'object' && !!field?.changeTracker) {
          field.changeTracker.acceptChanges(field);
        }
      }
    }
    // }
  }

  /**
   * Captures the original value for a property that is changing.
   *
   * @param propertyName - Name of property that is changing.
   * @param value - Updated value of the property.
   */
  public recordOriginalValue(propertyName: string, value: any) {
    if (this._changeTrackingEnabled && this._objectState !== ObjectState.added) {
      if (!this.originalValues.containsKey(propertyName)) {
        this.originalValues.set(propertyName, value);
      }
    }
  }

  /**
   * Records an addition to collection valued properties on SelfTracking Entities.
   *
   * @param propertyName - Name of property that is changing.
   * @param value - Value added to the property.
   */
  public recordAdditionToCollectionProperties(propertyName: string, value: any) {
    if (this._changeTrackingEnabled) {
      // Add the entity back after deleting it, we should do nothing here then
      if (this.objectsRemovedFromCollectionProperties.containsKey(propertyName)
        && this.objectsRemovedFromCollectionProperties.get(propertyName).contains(value)) {
        this.objectsRemovedFromCollectionProperties.get(propertyName).remove(value);
        if (this.objectsRemovedFromCollectionProperties.get(propertyName).count === 0) {
          this.objectsRemovedFromCollectionProperties.remove(propertyName);
        }
        return;
      }

      if (!this.objectsAddedToCollectionProperties.containsKey(propertyName)) {
        this.objectsAddedToCollectionProperties.set(propertyName, new ObjectList());
        this.objectsAddedToCollectionProperties.get(propertyName).add(value);
      } else {
        // this.objectsAddedToCollectionProperties.get(propertyName).add(value);
        const properties = this.objectsAddedToCollectionProperties.get(propertyName);
        if (Array.isArray(properties)) {
          const newProperties = new ObjectList();
          this.objectsAddedToCollectionProperties.set(propertyName, newProperties);
          newProperties.addRange(properties);
        } else {
          properties.add(value);
        }
      }
    }
  }

  /**
   * Records a removal to collection valued properties on SelfTracking Entities.
   *
   * @param propertyName - Name of property that is changing.
   * @param value - Value removed from the property.
   */
  public recordRemovalFromCollectionProperties(propertyName: string, value: any) {
    if (this._changeTrackingEnabled) {
      // Delete the entity back after adding it, we should do nothing here then
      if (this.objectsAddedToCollectionProperties.containsKey(propertyName)
        && this.objectsAddedToCollectionProperties.get(propertyName).contains(value)) {
        this.objectsAddedToCollectionProperties.get(propertyName).remove(value);
        if (this.objectsAddedToCollectionProperties.get(propertyName).count === 0) {
          this.objectsAddedToCollectionProperties.remove(propertyName);
        }
        return;
      }

      if (!this.objectsRemovedFromCollectionProperties.containsKey(propertyName)) {
        this.objectsRemovedFromCollectionProperties.set(propertyName, new ObjectList());
        this.objectsRemovedFromCollectionProperties.get(propertyName).add(value);
      } else {
        if (!this.objectsRemovedFromCollectionProperties.get(propertyName).contains(value)) {
          this.objectsRemovedFromCollectionProperties.get(propertyName).add(value);
        }
      }
    }
  }
  //#endregion
}
