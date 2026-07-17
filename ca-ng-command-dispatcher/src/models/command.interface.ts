export interface ICommand {
  /**
   * Command identifier
   */
  name: string;
  /**
   * The label of the command
   */
  label?: any;
  /**
   * The caption of the command
   */
  caption?: any;
  /**
   * Icon css associated class name
   */
  iconClassName?: any;
  /**
   * Html css associated class name
   */
  htmlClassName?: string;
  /**
   * Specifies whether command is visible.
   * It's possibile to specifies directly the boolean value
   * to show/hide command. By specifing a string instead (as property name),
   * system tries to found it on target
   * (e.g. @Command({ visible: 'targetPropertyName' }) => command.visible = target[visible])
   * @default true
   */
  visible?: boolean | string;
  /**
   * Specifies whether command is enabled.
   * It's possibile to specifies directly the boolean value
   * to enable/disable command. By specifing a string instead (as property name),
   * system tries to found it on target
   * (e.g. @Command({ enabled: 'targetPropertyName' }) => command.enabled = target[enabled])
   * @default true
   */
  enabled?: boolean | string;
  /**
   * Resource name linked to command
   */
  resource?: string;
  /**
   * Family that command belongs to
   */
  family?: string;
  /**
   * Command handler
   */
  handler?: Function;
  /**
   * Command properties
   */
  properties?: { [key: string]: any };
}
