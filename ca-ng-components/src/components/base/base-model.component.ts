import { EventEmitter, Injector, Input, OnInit, Output, Directive, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ShBaseAuthComponent } from './base-auth.component';
import { IShBaseOptions } from './base.component';
import { Subject } from 'rxjs';

/**
 * Base Component which introduces the binding to a property of a model
 */
@Directive()
export abstract class ShBaseModelComponent<T, O extends IShBaseOptions> extends ShBaseAuthComponent<O> implements OnInit, OnChanges, OnDestroy {
  /**
   * The object for which binds a property
   */
  @Input() public model: { [id: string]: T; };
  /**
   * The model property which will match the value of the control
   */
  @Input() public prop: string;
  /**
   * Event fired when model property value changes
   */
  @Output() public valueChanges = new EventEmitter<T>();
  /**
   * Registered handler for control value changes
   */
  public set controlChangeHandler(handler: (ev: T) => void) {
    this.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => handler(value));
  }

  /**
   * Observable which emits when model property changes
   */
  protected modelChange$ = new Subject<void>();

  /**
   * Base Component which introduces the binding to a property of a model
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit() {
    this.resource = this.getResource();
    super.ngOnInit();
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.modelChange$.next();
    }
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.modelChange$.complete();
  }

  /**
   * Provides the value of the model property
   */
  /*protected*/ public getModelValue() {
    if (this.model) {
      return this.model[this.prop];
    }
  }

  /**
   * Sets the value of the model property
   * @param value New value
   */
  /*protected*/ public setModelValue(value: T) {
    if (this.model) {
      if (this.internalOptions.onCanValueChanges(this.model[this.prop], value)) {
        this.model[this.prop] = value;
        this.valueChanges.emit(value);
      }
    }
  }

  /**
   * Provides the resource related to model property
   */
  /*protected*/ public getResource() {
    if (this.resource) {
      return this.resource;
    }
    const resource = this.resourceService.getResource(this.model, this.prop);
    if (resource) {
      return resource.uri;
    }
  }

}
