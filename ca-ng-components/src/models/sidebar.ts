export class /*interface*/ SidebarCommand {
  /**
   * Command identifier
   */
  id: string;
  /**
   * Command icon
   */
  icon: string;
  /**
   * Command title
   */
  title: string;
  /**
   * Resource linked to command
   */
  resource?: string;
  /**
   * Specifies whether the command is indexable (for full-text search)
   */
  hasIndex?: boolean;
  /**
   * If specified, the command acts like a router node
   */
  routerLink: string | string[];
  /**
   * List of command children
   */
  children?: SidebarCommand[];
}
