import { HelpManager } from './../../utilities/help.manager';
import { ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNoU, yieldFunc } from 'src/utilities/common.utility';
import { FormHandlerService } from '../../services/form-handler.service';
import { IdSequenceService } from '../../services/id-sequence.service';

/**
 * Base Component options contract
 */
export interface IShBaseOptions {
  /**
   * Control identifier
   * @default auto-generated
   */
  id?: string;
  /**
   * Control tab-index
   * @default 0
   */
  tabindex?: number;
  /**
   * Specifies if control take focus when is created
   * @default false
   */
  autofocus?: boolean;
  /**
   * List of css classes to be applied to control container
   * @default []
   */
  containerClass?: string[];
  /**
   * Width of the control
   * @default auto
   */
  width?: string | number | BehaviorSubject<string | number>;
  /**
   * Height of the control
   * @default auto
   */
  height?: string | number | BehaviorSubject<string | number>;
  /**
   * Event fired just before the value changes.
   * Asks if it's possible to change the value.
   * Returning false, the value will not vary
   * @param previousValue Current value
   * @param nextValue New value
   * @default ()=>true
   */
  onCanValueChanges?<T>(previousValue: T, nextValue: T): boolean;
}

/**
 * Base Component with base functions of a CA-Component
 */
export class ShBaseComponent<TOptions extends IShBaseOptions>
  implements OnChanges, OnInit, OnDestroy {
  /**
   * Base component configuration
   */
  @Input() public options: TOptions;
  /**
   * The help id to require info
   */
  @Input() public helpId: string;
  /**
   * Width of the control
   * @default auto
   */
  public width: string | number;
  /**
   * Height of the control
   * @default auto
   */
  public height: string | number;
  /**
   * A tooltip text for the control
   * @default undefined
   */
  public get tooltip() {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      return element.title;
    }
  }
  public set tooltip(value: any) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.title = isNoU(value) ? '' : `${value}`;
    }
  }
  /**
   * List of css classes to be applied to control container
   */
  public get containerClass() {
    return this.internalOptions.containerClass.join(' ');
  }
  /**
   * Registered handler for control keypress event
   */
  public set controlKeyPressHandler(handler: (ev: KeyboardEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onkeypress = handler;
    }
  }
  /**
   * Registered handler for control keydown event
   */
  public set controlKeyDownHandler(handler: (ev: KeyboardEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onkeydown = handler;
    }
  }
  /**
   * Registered handler for control keyup event
   */
  public set controlKeyUpHandler(handler: (ev: KeyboardEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onkeyup = handler;
    }
  }
  /**
   * Registered handler for control click event
   */
  public set controlClickHandler(handler: (ev: MouseEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onclick = handler;
    }
  }
  /**
   * Registered handler for control dblclick event
   */
  public set controlDblClickHandler(handler: (ev: MouseEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.ondblclick = handler;
    }
  }
  /**
   * Registered handler for control focus event
   */
  public set controlFocusHandler(handler: (ev: FocusEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onfocus = handler;
    }
  }
  /**
   * Registered handler for control focusout event
   */
  public set controlFocusOutHandler(handler: (ev: FocusEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onblur = handler;
    }
  }
  /**
   * Registered handler for control mousemove event
   */
  public set controlMouseMoveHandler(handler: (ev: MouseEvent) => void) {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    if (element) {
      element.onmousemove = handler;
    }
  }
  /**
   * Stores additional information about component
   */
  public tag: any;
  /**
   * Identifier generator service
   */
  protected idSequence: IdSequenceService;
  /**
   * Form Handler Service
   */
  protected formHandler: FormHandlerService;
  /**
   * Mapping of user options and default component options
   */
  public internalOptions: TOptions;
  /**
   * Control identifier
   */
  protected id: string;
  /**
   * Control tabindex
   */
  protected tabIndex = 0;
  /**
   * Subject which notifies subscribers when component destroy itself
   */
  protected destroy$ = new Subject();
  /**
   * References to control HTML element
   */
  @ViewChild('controlRef', { static: false })
  protected controlRef: ElementRef;
  /**
   * Specifies whether the helper is active
   */
  protected isHelperActive: boolean;

  /**
   * Base Component with base functions of a CA-Component
   */
  constructor(injector: Injector) {
    this.idSequence = injector.get(IdSequenceService);
    this.formHandler = injector.get(FormHandlerService);
    this.id = this.idSequence.next();
  }

  public ngOnInit() {
    HelpManager.isHelperActive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isHelperActive => this.isHelperActive = isHelperActive);
    
    this.onOptionsChanges();
    this.setupSize();
    yieldFunc(() => this.focusControl());
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this.internalOptions || (changes['options'] && !this.isChangeEqual(changes['options']))) {
      this.onOptionsChanges();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.formHandler.removeGroup(this);
  }

  /**
   * Gives focus to control
   */
  public giveFocus() {
    const element = this.controlRef && this.controlRef.nativeElement as HTMLElement;
    return element && element.focus();
  }

  /**
   * Fired on helper button clicked
   */
  public async onHelp(e?: PointerEvent, helpId?: string) {
    e && e.stopPropagation();
    const helpRequired = helpId || this.helpId;
    !isNoU(helpRequired) && await HelpManager.getHelp(helpRequired);
  }

  /**
   * Applies focus to control if autofocus is setted to true
   */
  protected focusControl() {
    if (this.internalOptions.autofocus) {
      this.giveFocus();
    }
  }

  /**
   * Event fired when user options changes
   */
  protected onOptionsChanges() {
    this.mergeOptions();
  }

  /**
   * Defines default component options which will be combined with user options
   * to create the internalOptions object
   */
  protected getDefaultOptions(): IShBaseOptions {
    return {
      id: this.id,
      tabindex: this.tabIndex,
      autofocus: false,
      containerClass: [],
      onCanValueChanges: () => true
    };
  }

  /**
   * Checks if an angular simple change bring effectively changes
   * @param change SimpleChange object of angular
   */
  protected isChangeEqual(change: SimpleChange) {
    return _.isEqualWith(change.previousValue, change.currentValue, this.equalCustomizer);
  }

  /**
   * Checks if a value is a simple object or a BehaviorSubject
   * @param value The value for which performs the check
   */
  protected isAsync<TValue>(value: TValue | BehaviorSubject<TValue>): value is BehaviorSubject<TValue> {
    return value instanceof BehaviorSubject;
  }

  /**
   * Compare customizer
   * @param objValue value 1
   * @param othValue value 2
   */
  private equalCustomizer(objValue: any, othValue: any) {
    if (objValue instanceof Function && othValue instanceof Function) {
      return objValue.name === othValue.name;
    }
  }

  /**
   * Options merge delegate
   */
  private mergeOptions() {
    this.internalOptions = _.mergeWith(this.getDefaultOptions(), this.options, this.mergeOptionsCustomizer);
  }

  /**
   * Options merge customizer
   * @param objValue value
   * @param srcValue source value
   * @param key key for which customizes
   */
  private mergeOptionsCustomizer(objValue: any, srcValue: any, key: string): any {
    return srcValue instanceof Array && objValue instanceof Array && _.endsWith(key, 'Class') ? srcValue.concat(objValue) : srcValue;
  }

  /**
   * Fills width and height control properties
   */
  private setupSize() {
    if (this.isAsync(this.internalOptions.width)) {
      this.internalOptions.width
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => this.width = this.getFormattedSize(value));
    } else {
      this.width = this.getFormattedSize(this.internalOptions.width);
    }
    if (this.isAsync(this.internalOptions.height)) {
      this.internalOptions.height
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => this.height = this.getFormattedSize(value));
    } else {
      this.height = this.getFormattedSize(this.internalOptions.height);
    }
  }

  /**
   * Retrieves size in a formatted string ready for binding
   * @param value The size
   */
  private getFormattedSize(value: string | number) {
    let retval: string;
    if (typeof value === 'number') {
      retval = `${value}px`;
    } else {
      retval = value;
    }
    return retval;
  }

}
