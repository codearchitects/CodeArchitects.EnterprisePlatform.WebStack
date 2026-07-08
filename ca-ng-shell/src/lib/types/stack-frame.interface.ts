export interface IStackFrame {
  id: string;
  label: string;
  isReturnPoint: boolean;
  input: any[];
  output: any[];
  application: any[];
  domain: any[];
  scenario: any[];
  action: any[];
  params?: { [key: string]: any };
}

export interface IStackFrameInfo {
  /**
   * Stack frame url
   */
  url: string;
  /**
   * Stack frame
   */
  frame: IStackFrame;
  /**
   * If true, the frame is referred to a new task
   */
  start?: boolean;
}

export const NEXT_STACK_FRAME_STORAGE_KEY = 'next-stack-frames';
