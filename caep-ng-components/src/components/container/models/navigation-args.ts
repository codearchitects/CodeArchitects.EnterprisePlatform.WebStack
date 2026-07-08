import { Params } from '@angular/router';
import { Activity, BaseDelegates } from '@ca-webstack/ng-shell';
import { ICaepSideMenuLinkedEntry } from './linked-entry';

/**
 * CaepSideMenu navigation arguments API.
 */
export interface ICaepSideMenuNavigationArgs {
  /**
   * Related menu entry.
   */
  entry: ICaepSideMenuLinkedEntry;
  /**
   * Application name.
   */
  application?: string | string[];
  /**
   * Domain name.
   */
  domain?: string | string[];
  /**
   * Scenario name.
   */
  scenario?: string | string[];
  /**
   * Action name.
   */
  action?: string | string[];
  /**
   * Query parameters.
   */
  queryParams?: Params;
  /**
   * Current activity.
   */
  activity?: Activity<any>;
  /**
   * Current delegates.
   */
  delegates?: BaseDelegates;
}
