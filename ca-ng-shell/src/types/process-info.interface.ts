import { IAction } from './action.interface';

export interface IProcessInfo {
  availableActions?: IAction[];
  invokedActions?: IAction[];
}
