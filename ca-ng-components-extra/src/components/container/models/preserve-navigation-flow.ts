import { ICaepSideMenuNavigationArgs } from './navigation-args';

/**
 * CaepSideMenu preserve navigation flow callback API.
 */
export type CaepSideMenuPreserveNavigationFlowCallback = (
  from: ICaepSideMenuNavigationArgs,
  to: ICaepSideMenuNavigationArgs
) => boolean;
