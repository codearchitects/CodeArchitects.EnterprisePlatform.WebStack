import { MetadataHelpers } from '@ca-webstack/reflection';
import { ICommand } from '../models/index';

export const CommandKey = 'command';

export interface ICommandParams {
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
   * Command properties
   */
  properties?: { [key: string]: any };
}

export function Command(params: ICommandParams) {
  return MetadataHelpers.defineMetadata(CommandKey, params, (target: any, targetKey: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      descriptor.enumerable = true;
    }
    const command = <ICommand>params;
    command.handler = target[targetKey];
    return command;
  });
}
