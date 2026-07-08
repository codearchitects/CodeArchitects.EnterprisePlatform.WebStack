import { ICaepSideMenuNavigationArgs } from './navigation-args';

/**
 * CaepSideMenu supported link kinds
 */
export enum CaepSideMenuLinkKind {
  /**
   * Navigation link
   */
  RouterLink = 'router-link',
  /**
   * Generic link
   */
  Link = 'link'
}
/**
 * CaepSideMenu link API
 */
export interface ICaepSideMenuLink {
  /**
   * Link kind.
   * @default CaepSideMenuLinkKind.RouterLink
   */
  kind?: CaepSideMenuLinkKind;
  /**
   * Resource locator.
   * This can be either a string following format /application/domain/scenario/state/...routeParams?queryParams#fragment, or a NavigationArgs object.
   */
  url: string | Omit<ICaepSideMenuNavigationArgs, 'entry'>;
  /**
   * HTML anchor element target attribute.
   */
  target?: string;
}
