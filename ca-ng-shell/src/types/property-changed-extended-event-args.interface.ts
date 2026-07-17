/**
 * Represents arguments for property changed event.
 */
export interface IPropertyChangedExtendedEventArgs {
  propertyName: string;
  container: any;
  newValue: any;
  oldValue: any;
}
