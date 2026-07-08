import { ICaepSideMenuEntry } from './entry';

/**
 * CaepSideMenu linked entry API. This interface is used to provide entry parent reference.
 */
export interface ICaepSideMenuLinkedEntry {
  /**
   * This entry.
   */
  entry: ICaepSideMenuEntry;
  /**
   * Parent entry reference.
   */
  parent?: ICaepSideMenuLinkedEntry;
}
