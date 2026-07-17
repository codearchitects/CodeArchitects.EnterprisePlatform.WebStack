import { Toast, BodyOutputType } from 'angular2-toaster';

/**
 * Toast available types
 */
export type ShToastType = 'default' | 'success' | 'error' | 'info';

/**
 * Toast Avatar
 */
export interface IShToastAvatar {
  /**
   * Avatar color
   */
  color: string;
  /**
   * Avatar icon name
   */
  icon: string;
  /**
   * Avatar icon color
   */
  iconColor?: string;
}

/**
 * Toast configuration
 */
export interface IShToastOptions {
  /**
   * Toast identifier
   */
  id?: string;
  /**
   * Toast title
   */
  title: string;
  /**
   * Toast type
   */
  type?: ShToastType;
  /**
   * Toast body
   */
  body?: string;
  /**
   * Toast click handler
   */
  onClick?: (toast: ShToast, isCloseButton: boolean) => boolean;
  /**
   * Toast show event
   */
  onShow?: (toast: ShToast) => void;
  /**
   * Toast hide event
   */
  onHide?: (toast: ShToast) => void;
  /**
   * Toast attribution
   */
  attribution?: string;
  /**
   * Toast avatar
   */
  avatar?: IShToastAvatar;
  /**
   * Eventual timeout different from the base toast configuration
   */
  timeout?: number;
}

/**
 * Shell Toast
 */
export class ShToast implements Toast {
  readonly type: string;
  title?: string;
  body?: string;
  bodyOutputType = BodyOutputType.TrustedHtml;
  toastId?: string;
  showCloseButton = true;
  onShowCallback?: (toast: ShToast) => void;
  onHideCallback?: (toast: ShToast) => void;
  timeout?: number;
  clickHandler?: (toast: ShToast, isCloseButton: boolean) => boolean;
  constructor(options: IShToastOptions) {
    this.toastId = options.id;
    this.title = options.title;
    this.timeout = options.timeout;
    this.body = `
    <div class="toast-body-message">${options.body}</div>
    <div class="toast-attribution">${options.attribution}</div>
    `;
    if (options.avatar) {
      this.body = `${this.body}
      <div class="toast-avatar" style="background:${options.avatar.color};">
          <i class="icon icon-${options.avatar.icon}" style="color:${options.avatar.iconColor}"></i>
      </div>
      `;
      this.type = 'wait';
    } else {
      this.type = options.type || this.type;
    }
    this.clickHandler = options.onClick;
    this.onShowCallback = options.onShow;
    this.onHideCallback = options.onHide;
  }
}
