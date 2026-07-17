import { Subject } from 'rxjs';
import { IPropertyChangedExtendedEventArgs } from './property-changed-extended-event-args.interface';

/**
 * Represents an entity with property changed event emitter.
 */
export interface INotifyPropertyChangedExtended {
  propertyChanged: Subject<IPropertyChangedExtendedEventArgs>;
}
