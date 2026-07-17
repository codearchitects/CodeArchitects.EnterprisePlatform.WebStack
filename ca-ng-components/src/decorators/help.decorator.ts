import { HelpManager } from '../utilities/help.manager';

export function Help(helpId: string | number) {
  return <T>(target: T, propertyKey: keyof T) => {
    HelpManager.register(target, propertyKey, typeof helpId === 'string' ? helpId : helpId.toString());
  };
}
