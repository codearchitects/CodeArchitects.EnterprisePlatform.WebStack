import { Serializer, JsonObject, JsonProperty, JsonIgnore, getJsonObject } from '@ca-webstack/reflection';
import { Subject } from 'rxjs';
import { List, Dictionary } from '@ca-webstack/data-structures';
import * as _ from 'lodash';
import { IObjectWithChangeTracker } from './object-with-change-tracker.interface';
import { ObjectState } from './object-state';

/**
 * Utility methos to apply on entity with change tracker.
 */
export class ObjectWithChangeTrackerExtensions {

    /**
     * Mark entity as deleted. If entity has change tracker disabled, it is enabled.
     *
     * @param trackingItem - Entity to mark as deleted.
     */
    public static markAsDeleted<T extends IObjectWithChangeTracker>(trackingItem: T) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = true;
      trackingItem.changeTracker.state = ObjectState.deleted;
      return trackingItem;
    }

    /**
     * Mark entity as added. If entity has change tracker disabled, it is enabled.
     *
     * @param trackingItem - Entity to mark as added.
     */
    public static markAsAdded<T extends IObjectWithChangeTracker>(trackingItem: T) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = true;
      trackingItem.changeTracker.state = ObjectState.added;
      return trackingItem;
    }

    /**
     * Mark entity as modified. If entity has change tracker disabled, it is enabled.
     *
     * @param trackingItem - Entity to mark as modified.
     */
    public static markAsModified<T extends IObjectWithChangeTracker>(trackingItem: T) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = true;
      trackingItem.changeTracker.state = ObjectState.modified;
      return trackingItem;
    }

    /**
     * Mark entity as unchanged. If entity has change tracker disabled, it is enabled.
     *
     * @param trackingItem - Entity to mark as unchanged.
     */
    public static markAsUnchanged<T extends IObjectWithChangeTracker>(trackingItem: T) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = true;
      trackingItem.changeTracker.state = ObjectState.unchanged;
      return trackingItem;
    }

    /**
     * Enable the change tracker of an entity.
     *
     * @param trackingItem - Entity to enable change tracker.
     */
    public static startTracking(trackingItem: IObjectWithChangeTracker) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = true;
    }

    /**
     * Disable the change tracker of an entity.
     *
     * @param trackingItem - Entity to disable change tracker.
     */
    public static stopTracking(trackingItem: IObjectWithChangeTracker) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      trackingItem.changeTracker.changeTrackingEnabled = false;
    }

    /**
     * Enable the change tracker recursively.
     *
     * @param trackingItem - Entity to enable change tracker.
     */
    public static enableChangeTracking(trackingItem: any) {
      ObjectWithChangeTrackerExtensions.switchChangeTracker(trackingItem, true);
    }

    /**
     * Disable the change tracker recursively.
     *
     * @param trackingItem - Entity to disable change tracker.
     */
    public static disableChangeTracking(trackingItem: any) {
      ObjectWithChangeTrackerExtensions.switchChangeTracker(trackingItem, false);
    }

    private static switchChangeTracker(trackingItem: any, enable: boolean) {
      if (!trackingItem) {
        throw new Error('trackingItem');
      }

      const checkList = new Array<IObjectWithChangeTracker>();
      ObjectWithChangeTrackerExtensions.switchChangeTrackingRecursive(trackingItem, enable, checkList);
    }

    private static switchChangeTrackingRecursive(trackingItem: any, enable: boolean, checkList: Array<IObjectWithChangeTracker>) {
      if (trackingItem instanceof Array) {
        trackingItem.forEach((subItem) => {
          ObjectWithChangeTrackerExtensions.switchChangeTrackingRecursive(subItem, enable, checkList);
        });
        return;
      }

      if (checkList.includes(trackingItem)) return;

      if (ObjectWithChangeTrackerExtensions.isTrackable(trackingItem)) {
        trackingItem.changeTracker.changeTrackingEnabled = enable;
      }

      checkList.push(trackingItem);

      for (const key in trackingItem) {
        if (_.isObjectLike(trackingItem[key])) {
          ObjectWithChangeTrackerExtensions.switchChangeTrackingRecursive(trackingItem[key], enable, checkList);
        }
      }
    }

    private static isTrackable(trackingItem: any) {
      return Boolean(trackingItem) && Boolean(trackingItem.changeTracker);
    }
  }
