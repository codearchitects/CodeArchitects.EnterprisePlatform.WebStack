import { ActiveToast } from 'ngx-toastr';
import { ɵunwrapSafeValue } from '@angular/core';

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
  //id?: string;
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
  onClick?: (toast: ShToast) => void;
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
export class ShToast {
  readonly type: string;
  title: string;
  body?: string;
  //bodyOutputType = BodyOutputType.TrustedHtml;
  toastId: number;
  showCloseButton = true;
  onShowCallback?: (toast: ShToast) => void;
  onHideCallback?: (toast: ShToast) => void;
  timeout?: number;
  onClickCallback?: (toast: ShToast) => void;

  constructor(options: IShToastOptions, toastDescriptor: ActiveToast<any>) {
    this.toastId = toastDescriptor.toastId;
    this.title = toastDescriptor.title;
    this.timeout = options.timeout;
    this.body = typeof toastDescriptor.message === 'string' ? toastDescriptor.message : ɵunwrapSafeValue(toastDescriptor.message);
    this.type = options.type || 'default';
    this.onClickCallback = options.onClick;
    this.onShowCallback = options.onShow;
    this.onHideCallback = options.onHide;
  }
}
