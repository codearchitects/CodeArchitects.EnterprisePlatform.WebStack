import { InjectionToken } from '@angular/core';
import { IStackFrame, ITaskSlot } from '@ca-webstack/ng-shell';

/**
 * CaepSideMenu stack frame factory
 */
export const CAEP_SIDE_MENU_STACK_FRAME_FACTORY = new InjectionToken<() => IStackFrame>(
  'CAEP_SIDE_MENU_STACK_FRAME_FACTORY'
);
/**
 * CaepSideMenu task slot factory
 */
export const CAEP_SIDE_MENU_TASK_SLOT_FACTORY = new InjectionToken<() => ITaskSlot>('CAEP_SIDE_MENU_TASK_SLOT_FACTORY');
