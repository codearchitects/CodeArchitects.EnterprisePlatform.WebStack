import { Subject } from 'rxjs';
import { JsonObject, JsonIgnore } from '@ca-webstack/reflection';
import {
  INotifyPropertyChanged,
  INotifyComplexPropertyChanging,
  ObjectChangeTracker,
  PropertyChangedEventArgs
} from '../index';

// complex type
@JsonObject({
  name: 'MySolution.Model.Data.Birthday, MySolution.Model'
})
export class Birthday implements INotifyComplexPropertyChanging, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _date: string;

  public get date() { return this._date; }
  public set date(value: string) {
    if (this._date !== value) {
      this.onComplexPropertyChanging();
      this._date = value;
      this.onPropertyChanged('date');
    }
  }
  // #endregion

  // #region ChangeTracking
  @JsonIgnore() private _complexPropertyChanging: Subject<void>;
  @JsonIgnore() private _propertyChanged: Subject<PropertyChangedEventArgs>;

  public static recordComplexOriginalValues(parentPropertyName: string, complexObject: Birthday, changeTracker: ObjectChangeTracker) {
    if (!parentPropertyName || parentPropertyName.trim().length === 0) {
      throw new Error('String parameter cannot be null or empty.');
    }

    if (!changeTracker) {
      throw new Error('Value cannot be null.');
    }
    changeTracker.recordOriginalValue(`${parentPropertyName}.date`, complexObject && complexObject.date);
  }

  protected onComplexPropertyChanging() {
    this.complexPropertyChanging.next(null);
  }

  @JsonIgnore()
  public get complexPropertyChanging() {
    if (!this._complexPropertyChanging) {
      this._complexPropertyChanging = new Subject<void>();
    }
    return this._complexPropertyChanging;
  }

  protected onPropertyChanged(propertyName: string) {
    this.propertyChanged.next({ propertyName: propertyName });
  }

  @JsonIgnore()
  public get propertyChanged() {
    if (!this._propertyChanged) {
      this._propertyChanged = new Subject<PropertyChangedEventArgs>();
    }
    return this._propertyChanged;
  }
  // #endregion
}