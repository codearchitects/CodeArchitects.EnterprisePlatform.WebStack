/**
 * @class IgnoreIfExistsStrategy
 */
import { IMergeStrategy } from '../merge-strategy';

export class IgnoreIfExistsStrategy implements IMergeStrategy {
  public merge<T>(newVal: T, oldVal: T) {
    return oldVal || newVal;
  }
}
