import { ICaepSideMenuLink } from './link';

/**
 * CaepSideMenu entry API
 */
export interface ICaepSideMenuEntry {
  /**
   * Entry unique identifier.
   * If not provided a UUID will be automatically generated.
   * @default UUID.UUID()
   */
  id?: string;
  /**
   * Link displayed text.
   */
  label: string;
  /**
   * Displayed icon.
   * @default `placeholderIcon`
   */
  icon?: string;
  /**
   * Entry link.
   */
  link?: ICaepSideMenuLink;
  /**
   * Whether this entry is enabled or not.
   * If this entry has children, user will not be able to view them.
   * @default true
   */
  enable?: boolean;
  /**
   * Whether this entry is visible or not.
   * @default true
   */
  show?: boolean;
  /**
   * Linked resource name.
   */
  resource?: string;
  /**
   * Child entries.
   */
  children?: ICaepSideMenuEntry[];
  /**
   * Whether this entry lazy loads child entries navigating towards this entry link.
   * When falsy and this entry has children no navigation will occur: this menu entry will act just as a toggle.
   */
  lazy?: boolean;
  /**
   * When enabled and user navigates towards this entry, navigation flow is preserved when closest ancestor preserves navigation.
   * **Be careful**: when using this utility, both entries must have a url associated with.
   * E.g.:
   * Given a menu graph like
   * 1
   *  - 1.1 (preserveNavigation = true)
   *    - 1.1.1
   *    - 1.1.2
   *  - 1.2
   *    - 1.2.1 (preserveNavigation = true)
   *    - 1.2.2
   * 2 (preserveNavigation = true)
   *  - 2.1
   *    - 2.1.1
   *    - 2.1.2
   *  - 2.2
   *    - 2.2.1
   *    - 2.2.2
   *    - 2.2.3 (preserveNavigation = false)
   *      - 2.2.3.1
   *      - 2.2.3.2
   *
   * navigation flow acts like:
   * - navigating from `1.2.1` towards same route `1.2.1` (e.g. changing parameters) will preserve navigation flow since this entry preserves
   * - navigating from `1.1.1` towards `1.1.2` will preserve navigation flow since its parent preserves
   * - navigating from `1.2.1` towards `1.1.1` and from `2` to `1` will not preserve navigation flow since they do not have a common parent which actually preserves navigation
   * - navigating from `2.1.1` towards `2.2.1` will preserve navigation flow since they have a common parent which preserves
   * - navigating from `2.2.3.1` towards `2.2.2` will not preserve navigation flow since `2.2.3` explicitly does not preserve navigation
   * - navigating from `2.2.3.1` towards `2.2.3.2` will not preserve navigation flow since even if they have a common preserve parent (`2`) they have closest parent which explicitly do not preserve
   */
  preserveNavigation?: boolean;
}
