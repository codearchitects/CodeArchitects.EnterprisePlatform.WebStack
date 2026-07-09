import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Mstring } from '@ca-webstack/ng-i18n';
import * as _ from 'lodash-es';
import 'reflect-metadata';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  CaepCoerceArrayString,
  CaepCoerceBoolean,
  CaepCoerceCssPixel,
  CaepCoerceNumber,
  CaepHook,
  CaepHookType
} from '../../decorators';
import { CaepHookManager, CaepSimpleOptionsChange, ICaepOptionsChanges } from '../../models';
import { CaepIdSequenceService } from '../../services/id-sequence.service';
import { PickAll, isNoU, yieldFunc } from '../../utilities/common.utility';

export interface ICaepBaseOptions extends PickAll<CaepBaseOptions> {}

/**
 * Base Component options contract
 */
export class CaepBaseOptions {
  constructor(options?: ICaepBaseOptions) {
    if (options) {
      for (const key in options) {
        if (!isNoU(options[key])) {
          this[key] = options[key];
        }
      }
    }
  }
}

/**
 * Base Component with base functions of a CA-Component
 */
@Directive()
export abstract class CaepBaseComponent<TOptions extends CaepBaseOptions = CaepBaseOptions>
  implements
    OnChanges,
    OnInit,
    OnDestroy,
    AfterViewInit,
    AfterViewChecked,
    AfterContentInit,
    AfterContentChecked,
    DoCheck,
    ICaepOptionsChanges
{
  /** Instance of change detection. */
  public changeDetectorRef: ChangeDetectorRef;
  /**
   * Base component configuration
   */
  @Input('options')
  public set hostOptions(value: TOptions) {
    if (!this.areOptionsEqual(this.options, value)) {
      const oldOptions = this.options;
      this.options = value instanceof CaepBaseOptions ? value : this._optionsCtor(value);
      const change = new CaepSimpleOptionsChange(oldOptions, this.options);
      this.caepOnOptionsChanges(change);
    }
  }
  public options: TOptions;

  /**
   * Control identifier
   * @default auto-generated
   */
  @Input() id?: string;

  /**
   * Control tab-index
   * @default 0
   */
  @Input()
  @CaepCoerceNumber()
  public tabindex: number | string = 0;

  /**
   * Specifies if control take focus when is created
   * @default false
   */
  @Input()
  @CaepCoerceBoolean()
  public autofocus: any = false;

  /**
   * label of the control
   * @default auto
   */
  @Input() public label?: string | Mstring;

  /**
   * Width of the control
   * @default auto
   */
  @Input()
  @CaepCoerceCssPixel()
  public width?: string | number;

  /**
   * Height of the control
   * @default auto
   */
  @Input()
  @CaepCoerceCssPixel()
  public height?: string | number;

  /**
   * String of css classes to be applied to control container
   * @default ''
   */
  @Input()
  @CaepCoerceArrayString()
  public containerClass: string | string[] = '';

  /**
   * A tooltip text for the control
   * @default undefined
   */
  @Input() public tooltip?: string;

  /**
   * Keypressed event
   */
  @Output() public keypressed = new EventEmitter<KeyboardEvent>();

  /**
   * Keydowned event
   */
  @Output() public keydowned = new EventEmitter<KeyboardEvent>();

  /**
   * Keyupped event
   */
  @Output() public keyupped = new EventEmitter<KeyboardEvent>();

  /**
   * Clicked event
   */
  @Output() public clicked = new EventEmitter<MouseEvent>();

  /**
   * DblClicked event
   */
  @Output() public dblclicked = new EventEmitter<MouseEvent>();

  /**
   * Focused event
   */
  @Output() public focused = new EventEmitter<FocusEvent>();

  /**
   * Blurred event
   */
  @Output() public blurred = new EventEmitter<FocusEvent>();

  /**
   * Mousemoved event
   */
  @Output() public mousemoved = new EventEmitter<MouseEvent>();

  /**
   * Stores additional information about component
   */
  public tag: any;

  /**
   * Identifier generator service
   */
  public idSequence: CaepIdSequenceService;

  /**
   * Subject which notifies subscribers when component destroy itself
   */
  public destroy$ = new Subject<void>();

  /**
   * References to control HTML element
   */
  @ViewChild('controlRef') public controlRef: ElementRef;

  /**
   * controlRef change flag
   */
  protected controlRefUpdate = false;

  /**
   * Emitter for call to afterContentInit lifecycle hook
   */
  private _afterContentInitCall$: Subject<void> = new Subject();

  /**
   * Emitter for call to afterContentInit lifecycle hook
   */
  public readonly afterContentInitCall$ = this._afterContentInitCall$.asObservable();

  /**
   * Hook manager reference
   */
  private _hookManager: CaepHookManager;

  /**
   * Base Component with base functions of a CA-Component
   */
  constructor(
    protected injector: Injector,
    private _optionsCtor: (value?: PickAll<TOptions>) => TOptions = (value?: PickAll<TOptions>) =>
      new CaepBaseOptions(value) as TOptions
  ) {
    this.idSequence = injector.get(CaepIdSequenceService);
    this.id = this.idSequence.next();
    this.options = this._optionsCtor();
    this._hookManager = new CaepHookManager(this);
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
    injector.get(ElementRef).nativeElement.component = this;
  }

  public ngOnInit() {
    this._hookManager.initialize();
  }

  public ngOnChanges(changes: SimpleChanges) {
    this._hookManager.change(changes);
  }

  public ngAfterViewInit() {
    this._hookManager.initializeAfterViewInit();
  }

  public ngAfterViewChecked() {
    this._hookManager.initializeAfterViewCheck();
  }

  public ngDoCheck() {
    this._hookManager.doCheck();
  }

  public ngAfterContentInit() {
    this._afterContentInitCall$.next();
    this._hookManager.initializeAfterContentInit();
  }

  public ngAfterContentChecked() {
    this._hookManager.initializeAfterContentCheck();
  }

  public ngOnDestroy() {
    this._hookManager.destroy();
  }

  public caepOnOptionsChanges(change: CaepSimpleOptionsChange) {
    this._hookManager.optionsChange(change);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Registers event handlers on the element representing the control
   */
  @CaepHook({ type: CaepHookType.AfterViewInit })
  protected registerEvents() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    if (element) {
      if (this.keypressed.observed) element.onkeypress = (ev: KeyboardEvent) => this.keypressed.emit(ev);
      if (this.keydowned.observed) element.onkeydown = (ev: KeyboardEvent) => this.keydowned.emit(ev);
      if (this.keyupped.observed) element.onkeyup = (ev: KeyboardEvent) => this.keyupped.emit(ev);
      if (this.clicked.observed) element.onclick = (ev: MouseEvent) => this.clicked.emit(ev);
      if (this.dblclicked.observed) element.ondblclick = (ev: MouseEvent) => this.dblclicked.emit(ev);
      if (this.focused.observed) element.onfocus = (ev: FocusEvent) => this.focused.emit(ev);
      if (this.blurred.observed) element.onblur = (ev: FocusEvent) => this.blurred.emit(ev);
      if (this.mousemoved.observed) element.onmousemove = (ev: MouseEvent) => this.mousemoved.emit(ev);
    }
    return element;
  }

  /**
   * Gives focus to control
   */
  public giveFocus() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    return element?.focus();
  }

  /**
   * Applies focus to control if autofocus is set to true
   */
  public focusControl() {
    if (this.autofocus) {
      this.giveFocus();
    }
  }

  /**
   * Checks if an angular simple change bring effectively changes
   * @param change SimpleChange object of angular
   */
  public isChangeEqual(change: SimpleChange) {
    return _.isEqualWith(change.previousValue, change.currentValue, this.equalCustomizer);
  }

  /**
   * Checks if two option objects are equal
   * @param previousOptions previous option object
   * @param currentOptions new option object
   */
  public areOptionsEqual(previousOptions: CaepBaseOptions, currentOptions: CaepBaseOptions | ICaepBaseOptions) {
    let result = true;
    if (currentOptions instanceof CaepBaseOptions) {
      result = _.isEqualWith(previousOptions, currentOptions, this.equalCustomizer);
    } else {
      let newOptionsKeys = Object.keys(currentOptions);
      for (let optionKey of newOptionsKeys) {
        if (!_.isEqualWith(previousOptions[optionKey], currentOptions[optionKey], this.equalCustomizer)) {
          result = false;
          break;
        }
      }
    }
    return result;
  }

  /**
   * Checks if a value is a simple object or a BehaviorSubject
   * @param value The value for which performs the check
   */
  public isAsync<TValue>(value: TValue | BehaviorSubject<TValue>): value is BehaviorSubject<TValue> {
    return value instanceof BehaviorSubject;
  }

  /**
   * Checks if a value is observable
   * @param value The value
   */
  public isObservable<TValue>(value: any): value is Observable<TValue> {
    return Boolean(value && value.subscribe);
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
   * Executes focusControl call with yield
   */
  @CaepHook({ type: CaepHookType.Init })
  private setupFocusControl() {
    yieldFunc(() => this.focusControl());
  }

  /**
   * Sets element title
   * @param value tooltip for the element
   */
  @CaepHook({ type: CaepHookType.AfterViewInit })
  private setupTooltip() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    if (element) element.title = isNoU(this.tooltip) ? '' : `${this.tooltip}`;
  }

  /**
   * Sets element title when tooltip input property changes
   * @param changes SimpleChanges object containing tooltip change
   */
  @CaepHook({ type: CaepHookType.Change })
  private onTooltipChange(changes: SimpleChanges) {
    if (changes['tooltip']?.previousValue && !this.isChangeEqual(changes['tooltip'])) {
      const element = this.controlRef?.nativeElement as HTMLElement;
      if (element) element.title = isNoU(changes['tooltip'].currentValue) ? '' : `${changes['tooltip'].currentValue}`;
    }
  }

  /**
   * Calls methods that depend on controlRef instance when control reference changes
   */
  @CaepHook({ type: CaepHookType.AfterViewChecked })
  private onControlRefChange() {
    if (this.controlRefUpdate) {
      this.setupFocusControl();
      this.registerEvents();
      this.setupTooltip();
      this.controlRefUpdate = false;
    }
  }

  /**
   * Emits on destroy$ subject
   */
  @CaepHook({ type: CaepHookType.Destroy })
  private emitDestroyEvent() {
    this.destroy$.next();
  }
}
