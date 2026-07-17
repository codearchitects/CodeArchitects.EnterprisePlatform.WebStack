import { BehaviorSubject } from 'rxjs';
import { isNoU } from '../utilities/common.utility';
import * as _ from 'lodash';

/**
 * Base command interface
 */
export interface IShBaseCommand {
  /**
   * Command identifier
   */
  id?: string;
  /**
   * Command icon
   */
  icon?: string;
  /**
   * Command name
   */
  name: string;
  /**
   * Specifies if command is enabled
   */
  enable?: boolean | BehaviorSubject<boolean> | ((command: IShBaseCommand) => boolean);
  /**
   * Specifies if command is visible
   */
  show?: boolean | BehaviorSubject<boolean> | ((command: IShBaseCommand) => boolean);
  /**
   * Resource linked to command
   */
  resource?: string;
  /**
   * Command children
   */
  children?: IShBaseCommand[];
  /**
   * Command handler
   */
  handler?(...params: any[]): void;
}

/**
 * Base command
 */
export class ShBaseCommand implements IShBaseCommand {
  public id: string;
  public icon: string;
  public name: string;
  public enable: boolean | BehaviorSubject<boolean> | ((command: IShBaseCommand) => boolean);
  public show: boolean | BehaviorSubject<boolean> | ((command: IShBaseCommand) => boolean);
  public resource: string;
  public children: IShBaseCommand[];
  public handler?(...params: any[]): void;
  /**
   * Specifies whether command is enabled
   */
  public get isEnabled() {
    let retval: boolean;
    if (this.enable instanceof BehaviorSubject) {
      retval = this.enable.getValue();
    } else if (_.isFunction(this.enable)) {
      retval = this.enable(this);
    } else {
      retval = this.enable;
    }
    return retval;
  }
  /**
   * Specifies whether command is shown
   */
  public get isShown() {
    let retval: boolean;
    if (this.show instanceof BehaviorSubject) {
      retval = this.show.getValue();
    } else if (_.isFunction(this.show)) {
      retval = this.show(this);
    } else {
      retval = this.show;
    }
    return retval;
  }

  /**
   * Base command
   * @param options Base command options
   */
  constructor(options: IShBaseCommand) {
    this.id = options.id;
    this.icon = options.icon;
    this.name = options.name;
    this.enable = isNoU(options.enable) ? true : options.enable;
    this.show = isNoU(options.show) ? true : options.show;
    this.resource = options.resource;
    this.children = options.children;
    this.handler = isNoU(options.handler) ? () => undefined : options.handler;
  }
}
