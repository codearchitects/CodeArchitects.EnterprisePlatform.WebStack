//#region EnumForObjectState

/**
 * Represents all possible states on SelfTracking Entities.
 */
export enum ObjectState {
  detached = 0,
  unchanged = 0x1,
  added = 0x2,
  modified = 0x4,
  deleted = 0x8
}
//#endregion
