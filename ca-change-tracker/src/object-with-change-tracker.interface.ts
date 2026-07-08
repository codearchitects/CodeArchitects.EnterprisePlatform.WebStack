import { ObjectChangeTracker } from './object-change-tracker';

/**
 * Represents an entity with object change tracker.
 */
export interface IObjectWithChangeTracker {
  changeTracker: ObjectChangeTracker;
}
