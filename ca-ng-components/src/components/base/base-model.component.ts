import { EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HelpManager } from '../../utilities/help.manager';
import { isNoU } from './../../utilities/common.utility';
import { ShBaseAuthComponent } from './base-auth.component';
import { IShBaseOptions } from './base.component';

/**
 * Base Component which introduces the binding to a property of a model
 */
export abstract class ShBaseModelComponent<T, O extends IShBaseOptions> extends ShBaseAuthComponent<O> implements OnInit, OnChanges {
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
   * Base Component which introduces the binding to a property of a model
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit() {
    this.resource = this.getResource();
    super.ngOnInit();

    HelpManager.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(refreshInfo => {
        if (refreshInfo) {
          const { classInstance, propertyName } = refreshInfo;
          if (classInstance === this.model && propertyName === this.prop) {
            this.helpId = HelpManager.get(this.model, this.prop);
          }
        }
      });

    this.helpId = this.helpId || HelpManager.get(this.model, this.prop);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const isModelChanged = changes && changes.model && changes.model.currentValue;
    const isPropChanged = changes && changes.prop && changes.prop.currentValue;
    if (isModelChanged || isPropChanged) {
      this.helpId = this.helpId || HelpManager.get(this.model, this.prop);
    }
  }

  /**
   * Fired on key down
   */
  protected onKeyDown(e: KeyboardEvent, compareKeyForHelp?: string, helpId?: string) {
    if (e.key === compareKeyForHelp && !isNoU(helpId || this.helpId)) {
      e.preventDefault();
      this.onHelp(undefined, helpId);
    }
  }

  /**
   * Provides the value of the model property
   */
  protected getModelValue() {
    if (this.model) {
      return this.model[this.prop];
    }
  }

  /**
   * Sets the value of the model property
   * @param value New value
   */
  protected setModelValue(value: T) {
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
  protected getResource() {
    if (this.resource) {
      return this.resource;
    }
    const resource = this.resourceService.getResource(this.model, this.prop);
    if (resource) {
      return resource.uri;
    }
  }

}
