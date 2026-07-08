/**
 * @class OverwriteAlwaysStrategy
 */
import { IMergeStrategy, OverwriteStrategy } from '../merge-strategy';

export class OverwriteAlwaysStrategy extends OverwriteStrategy implements IMergeStrategy {
  public merge<T>(newVal: T, oldVal: T) {
    return this.overwrite(newVal, oldVal);
  }
}
