/**
 * CaepSideMenu MapToUrl hook options API.
 */
export interface ICaepSideMenuMapToUrlOptions {
  /**
   * Whether to prepend `start` action if given action segment does not start with `start`.
   */
  addStart?: boolean;
  /**
   * Whether to add task id within url at defined index.
   */
  addTaskId?: boolean;
}
