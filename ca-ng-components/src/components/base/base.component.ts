import { ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild, Directive } from '@angular/core';
import * as _ from 'lodash-es';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNoU, yieldFunc } from '../../utilities/common.utility';
import { IdSequenceService } from '../../services/id-sequence.service';
import { Mstring } from '@ca-webstack/ng-i18n';
import { FormHandlerService } from '../../services/form-handler.service';

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
   * label of the control
   * @default auto
   */
   label?:string | boolean | Mstring;
  /**
   * Accessible name exposed as `aria-label` when no visible label is
   * associated with the control (WCAG 4.1.2). Prefer a visible, associated
   * label where possible.
   * @default undefined
   */
  ariaLabel?: string;
  /**
   * Space-separated id(s) of the element(s) that label this control, exposed
   * as `aria-labelledby` (WCAG 1.3.1 / 4.1.2).
   * @default undefined
   */
  ariaLabelledBy?: string;
  /**
   * Space-separated id(s) of the element(s) that describe this control (hint,
   * validation message, …), exposed as `aria-describedby` (WCAG 1.3.1).
   * @default undefined
   */
  ariaDescribedBy?: string;
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
@Directive()
export class ShBaseComponent<TOptions extends IShBaseOptions>
  implements OnChanges, OnInit, OnDestroy {
  /**
   * Base component configuration
   */
  @Input() public options: TOptions;
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
   * Accessible name for the control (`aria-label`). `null` when unset so the
   * bound attribute is not rendered. (WCAG 4.1.2)
   */
  public get ariaLabel(): string | null {
    return this.internalOptions?.ariaLabel ?? null;
  }
  /**
   * Id(s) of the element(s) labelling the control (`aria-labelledby`). `null`
   * when unset. (WCAG 1.3.1 / 4.1.2)
   */
  public get ariaLabelledBy(): string | null {
    return this.internalOptions?.ariaLabelledBy ?? null;
  }
  /**
   * Id(s) of the element(s) describing the control (`aria-describedby`).
   * `null` when unset. (WCAG 1.3.1)
   */
  public get ariaDescribedBy(): string | null {
    return this.internalOptions?.ariaDescribedBy ?? null;
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
  /*protected*/ public idSequence: IdSequenceService;
  /**
   * Form Handler Service
   */
  /*protected*/ public formHandler: FormHandlerService;
  /**
   * Mapping of user options and default component options
   */
  /*protected*/ public internalOptions: TOptions;
  /**
   * Control identifier
   */
  /*protected*/ public id: string;
  /**
   * Control tabindex
   */
  /*protected*/ public tabIndex = 0;
  /**
   * Subject which notifies subscribers when component destroy itself
   */
  /*protected*/ public destroy$ = new Subject<void>();
  /**
   * References to control HTML element
   */
  @ViewChild('controlRef')
  /*protected*/ public controlRef: ElementRef;

  /**
   * Base Component with base functions of a CA-Component
   */
  constructor(injector: Injector) {
    this.idSequence = injector.get(IdSequenceService);
    this.formHandler = injector.get(FormHandlerService);
    this.id = this.idSequence.next();
  }

  public ngOnInit() {
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
   * Applies focus to control if autofocus is setted to true
   */
  /*protected*/ public focusControl() {
    if (this.internalOptions.autofocus) {
      this.giveFocus();
    }
  }

  /**
   * Event fired when user options changes
   */
  /*protected*/ public onOptionsChanges() {
    this.mergeOptions();
  }

  /**
   * Defines default component options which will be combined with user options
   * to create the internalOptions object
   */
  /*protected*/ public getDefaultOptions(): IShBaseOptions {
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
  /*protected*/ public isChangeEqual(change: SimpleChange) {
    return _.isEqualWith(change.previousValue, change.currentValue, this.equalCustomizer);
  }

  /**
   * Checks if a value is a simple object or a BehaviorSubject
   * @param value The value for which performs the check
   */
  /*protected*/ public isAsync<TValue>(value: TValue | BehaviorSubject<TValue>): value is BehaviorSubject<TValue> {
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
