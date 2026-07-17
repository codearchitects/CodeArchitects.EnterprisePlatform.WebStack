import { IProcessInfo } from './process-info.interface';
import { IActivityAnnotation } from './activity-annotation.interface';
import { IStackFrame } from './stack-frame.interface';

export interface IActivityPayload extends IProcessInfo {
  version?: number;
  stack: IStackFrame[];
  taskId: string;
  params?: { [key: string]: any };
  annotations: IActivityAnnotation[];
}
