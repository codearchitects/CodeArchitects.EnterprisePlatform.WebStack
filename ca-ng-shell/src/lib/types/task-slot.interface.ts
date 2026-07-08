import { IStackFrame } from './stack-frame.interface';

export interface ITaskSlot {
  taskId: string;
  payload: any;
  stack: IStackFrame[];
}
