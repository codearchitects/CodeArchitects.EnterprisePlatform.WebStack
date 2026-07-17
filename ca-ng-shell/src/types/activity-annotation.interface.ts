import { IActivityAnnotationBuiltin } from './activity-annotation-builtin.interface';

export interface IActivityAnnotation
  extends IActivityAnnotationBuiltin {
  [keys: string]: any;
}
