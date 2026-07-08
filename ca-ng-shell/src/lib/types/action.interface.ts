import { IParameter } from './parameter.interface';

/**
 * process action
 */
export interface IAction {
  /**
   * name of action
   */
  name: string;
  /**
   * action namespace
   */
  namespace: string;
  /**
   * action paramteres
   */
  parameters: IParameter[];
}
