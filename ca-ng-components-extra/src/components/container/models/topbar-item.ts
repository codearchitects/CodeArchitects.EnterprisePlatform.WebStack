import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Caep Topbar item available positions.
 */
export enum CaepTopbarItemPosition {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}
/**
 * Caep Topbar item API.
 * @template T Template ref context type.
 */
export interface ICaepTopbarItem<T extends { $implicit: ICaepTopbarItem } = any> {
  /**
   * Item identifier.
   * @default 'UUID.UUID()'
   */
  id?: string;
  /**
   * Item icon.
   * If template ref is not provided, this will represent item visually.
   */
  icon?: string;
  /**
   * HTML aria-label attribute used for accessibility when displaying an icon. This label will be translated using `TranslateService`.
   */
  ariaLabel?: string;
  /**
   * HTML aria-labelledby attribute used for accessibility when displaying an icon.
   */
  ariaLabelledby?: string;
  /**
   * Associated resource name.
   */
  resource?: string;
  /**
   * Whether item is visible or not.
   * @default true
   */
  show?: boolean;
  /**
   * Whether item is enabled or not.
   * @default true
   */
  enable?: boolean;
  /**
   * Item position.
   * @default CaepTopbarItemPosition.Right
   */
  position?: CaepTopbarItemPosition;
  /**
   * Item order. This indicates item ordering, based on position.
   */
  order?: number;
  /**
   * Item priority, lowest is higher. This determines how items disappear when not enough space.
   */
  priority?: number;
  /**
   * This indicates a class, or a list of classes, which item will have.
   * This can be either an observable in order to change container class based on item status.
   */
  containerClass?: string | string[] | Observable<string | string[]>;
  /**
   * Item template ref.
   */
  templateRef?: TemplateRef<T>;
  /**
   * Custom template ref context. Useful when templates is used for multiple items.
   * By default context $implicit value is the model itself.
   */
  templateContext?: T;
  /**
   * When default template is used, this will represent the action executed when user clicks on this item.
   * @default noop // A function which executes no action
   */
  handler?: ((event: MouseEvent) => any) | Function;
}
