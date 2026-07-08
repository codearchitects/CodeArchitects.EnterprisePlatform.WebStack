import { Directive, EventEmitter, Injector, Input, Output } from '@angular/core';
import { CaepHook, CaepHookType } from '../../decorators';
import { CaepValueChange } from '../../models';
import { PickAll } from '../../utilities';
import { CaepBaseAuthComponent } from './base-auth.component';
import { CaepBaseOptions } from './base.component';

/**
 * Base Component which introduces the binding to a property of a model
 */
@Directive()
export abstract class CaepBaseModelComponent<
  T,
  O extends CaepBaseOptions = CaepBaseOptions
> extends CaepBaseAuthComponent<O> {
  /**
   * The object for which binds a property
   */
  @Input() public model: { [id: string]: any };

  /**
   * The model property which will match the value of the control
   */
  @Input() public prop: string;

  /**
   * Event fired when model property value changes
   */
  @Output() public valueChanges = new EventEmitter<T>();

  /**
   * Event fired when a model property value change is requested
   */
  @Output() public canValueChange = new EventEmitter<CaepValueChange<T>>();

  /**
   * Registered handler for control value changes
   */
  /*public set controlChangeHandler(handler: (ev: T) => void) {
    this.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => handler(value));
  }*/

  /**
   * Base Component which introduces the binding to a property of a model
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<O>) => O = (value?: PickAll<O>) => new CaepBaseOptions(value) as O
  ) {
    super(injector, optionsCtor);
  }

  /**
   * Provides the value of the model property
   */
  public getModelValue(): T {
    if (this.model) {
      return this.model[this.prop];
    }
  }

  /**
   * Emits the request to set the value of the model property
   * @param value New value
   */
  public setModelValue(value: T) {
    if (this.model) {
      if (this.canValueChange.observed) {
        const valueChange = new CaepValueChange(this.model, this.prop, value, this.valueChanges);
        this.canValueChange.emit(valueChange);
      } else {
        this.model[this.prop] = value;
        this.valueChanges.emit(value);
      }
    }
  }

  /**
   * Provides the resource related to model property
   */
  public getResource() {
    if (this.resource) {
      return this.resource;
    }
    const resource = this.resourceService.getResource(this.model, this.prop);
    if (resource) {
      return resource.uri;
    }
  }

  /**
   * Initialize resource before BaseAuth OnInit handlers' execution
   */
  @CaepHook({ type: CaepHookType.Init, priority: 1, runBeforeSuper: true })
  private initializeResource() {
    this.resource = this.getResource();
  }
}
