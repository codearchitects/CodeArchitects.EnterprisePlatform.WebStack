import { Subject, Subscription } from 'rxjs';
import { JsonObject, JsonIgnore } from '@ca-webstack/reflection';
import {
  IObjectWithChangeTracker,
  INotifyPropertyChanged,
  ObjectChangeTracker,
  ObjectStateChangingEventArgs,
  PropertyChangedEventArgs,
  ObjectState
} from '../index';

// 1 to n association with no navigational property
@JsonObject({
  name: 'MySolution.Model.Data.City, MySolution.Model'
})
export class City implements IObjectWithChangeTracker, INotifyPropertyChanged {
  // #region Primitive Properties
  @JsonIgnore() private _id: string;

  public get id() { return this._id; }
  public set id(value: string) {
    if (this._id !== value) {
      if (this.changeTracker.changeTrackingEnabled && this.changeTracker.state !== ObjectState.added) {
        throw new Error('The property \'Id\' is part of the object\'s key and cannot be changed.');
      }
      this._id = value;
      this.onPropertyChanged('id');
    }
  }
  // #endregion

  // #region ChangeTracking
  @JsonIgnore() private _propertyChanged: Subject<PropertyChangedEventArgs>;
  @JsonIgnore() private _changeTracker: ObjectChangeTracker;
  @JsonIgnore() private _subscriptions: Map<string, Subscription>;

  protected onPropertyChanged(propertyName: string) {
    if (this.changeTracker.state !== ObjectState.added && this.changeTracker.state !== ObjectState.deleted) {
      this.changeTracker.state = ObjectState.modified;
    }
    this.propertyChanged.next({ propertyName: propertyName });
  }

  protected onNavigationPropertyChanged(propertyName: string) {
    this.propertyChanged.next({ propertyName: propertyName });
  }

  @JsonIgnore()
  public get propertyChanged() {
    if (!this._propertyChanged) {
      this._propertyChanged = new Subject<PropertyChangedEventArgs>();
    }
    return this._propertyChanged;
  }

  public get changeTracker(): ObjectChangeTracker {
    if (!this._changeTracker) {
      this._changeTracker = new ObjectChangeTracker();
      const subscription = this._changeTracker.objectStateChanging.subscribe(this.handleObjectStateChanging.bind(this));
      this.subscriptions.set('changeTracker', subscription);
    }
    return this._changeTracker;
  }
  public set changeTracker(value: ObjectChangeTracker) {
    if (this.subscriptions.has('changeTracker')) {
      this.subscriptions.get('changeTracker').unsubscribe();
    }
    this._changeTracker = value;
    if (this._changeTracker) {
      const subscription = this._changeTracker.objectStateChanging.subscribe(this.handleObjectStateChanging.bind(this));
      this.subscriptions.set('changeTracker', subscription);
    }
  }

  @JsonIgnore()
  public get subscriptions() {
    if (!this._subscriptions) {
      this._subscriptions = new Map<string, Subscription>();
    }
    return this._subscriptions;
  }

  protected handleObjectStateChanging(e: ObjectStateChangingEventArgs) {
    if (e.newState === ObjectState.deleted) {
      this.clearNavigationProperties();
    }
  }

  protected clearNavigationProperties() { ; }
  // #endregion
}