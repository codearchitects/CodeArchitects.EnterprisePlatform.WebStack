import { TrackableCollection } from './trackable-collection';
import { TrackableCollectionFactory } from './trackable-collection-factory';

export class TrackableCollectionUtils {
  public static convertTcToArray<T>(type: any, tc: TrackableCollection<T>) {
    return Object.setPrototypeOf(tc, Array.prototype);
  }

  public static convertArrayToTc<T>(type: any, array: Array<T>) {
    return TrackableCollectionFactory.getInstance(...array);
  }
}
