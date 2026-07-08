/**
 * Represents a basic change from a previous to a new value for component options, passed to OnOptionsChanges hook
 */
export class CaepSimpleOptionsChange {
  /**
   * Basic option change
   *
   * @param previousOptions previous options value
   * @param currentOptions current new options value
   */
  constructor(public previousOptions: any, public currentOptions: any) {}
}

/**
 * A lifeycle hook that is called when component options are updated. Define an caepOnOptionsChanges() method to handle the changes. It is called before Angular lifecycle ngOnChanges.
 */
export interface ICaepOptionsChanges {
  caepOnOptionsChanges(change: CaepSimpleOptionsChange): void;
}
