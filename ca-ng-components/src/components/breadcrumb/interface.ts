/**
 * Breadcrumb stack frame contract
 */
export interface IShBreadcrumbStackFrame {
  /**
   * Specifies whether stack frame is a return point
   */
  isReturnPoint?: boolean;
  /**
   * Stack frame label to be shown into breadcrumb
   */
  label?: string;
  /**
   * Action name and optional parameters array
   */
  action?: string[];
  /**
   * Scenario name and optional parameters array
   */
  scenario?: string[];
  /**
   * Domain name and optional parameters array
   */
  domain?: string[];
  /**
   * Application name and optional parameters array
   */
  application?: string[];
}
