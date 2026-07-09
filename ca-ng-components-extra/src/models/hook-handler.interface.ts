import { CaepHookType } from '../decorators';

export interface ICaepHookHandler {
  type: CaepHookType;
  className: string;
  handler: Function;
  priority?: number;
  runBeforeSuper?: boolean;
}
