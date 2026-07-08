/**
 * @class OverwriteIfNotChangedStrategy
 */
import { IObjectWithChangeTracker, ObjectState } from '@ca-webstack/change-tracker';
import { OverwriteStrategy, IMergeStrategy } from '../merge-strategy';

export class OverwriteIfNotChangedStrategy extends OverwriteStrategy implements IMergeStrategy {
  public merge<T>(newVal: T, oldVal: T) {
    // oldVal should be a IObjectWithChangeTracker
    if (!(oldVal as any).changeTracker || (oldVal as any).changeTracker.state !== ObjectState.unchanged)
      return oldVal;

    return this.overwrite(newVal, oldVal);
  }
}
