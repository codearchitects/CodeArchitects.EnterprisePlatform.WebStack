/**
 * VB6 Error object
 */
export interface IVB6Error<TSource = any, TDescription = any> {
  /**
   * Error number
   */
  Number: number;
  /**
   * Error description
   */
  Description: TDescription;
  /**
   * Error source
   */
  Source?: TSource;
  /**
   * Clear error
   */
  Clear?(): void;
  /**
   * Raises an error
   * @param number Error number
   * @param source Error source
   * @param description Error description
   */
  Raise?(number: number, source?: TSource, description?: TDescription, ...deprecatedParams: any[]): void;
}

/**
 * VB6 Error object
 */
class VB6ErrorDefinition<TSource = any, TDescription = any> implements IVB6Error<TSource> {
  private static __instance: VB6ErrorDefinition;

  private constructor() {
  }

  public Number: number;

  public Description: TDescription;

  public Source: TSource;

  static getInstance(): VB6ErrorDefinition {
    if (!VB6ErrorDefinition.__instance) {
      VB6ErrorDefinition.__instance = new VB6ErrorDefinition();
    }

    return VB6ErrorDefinition.__instance;
  }

  Clear() {
    this.Number = undefined;
    this.Description = undefined;
  }

  Raise(number: number, source?: TSource, description?: TDescription, ...deprecatedParams: any[]) {
    this.Number = number;
    this.Description = description;
    this.Source = source;
    console.error(`Error ${number}: ${description}`);
  }
}

export const VB6Error = VB6ErrorDefinition.getInstance();
