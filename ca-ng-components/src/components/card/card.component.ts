import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ShFormGroup } from '../../utilities/form-group.utility';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { ShBaseCommand } from '../../models/command';
import { isNoU, yieldFunc } from '../../utilities';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
    selector: 'sh-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShCardComponent<T> extends ShBaseAuthComponent<IShBaseOptions> implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The object binded to the card (for validations)
   * @default {}
   */
  @Input() public model: T = {} as any;
  /**
   * The parent object which contains the model
   */
  @Input() public parent?: { [id: string]: T; };
  /**
   * The prop name on the parent object which identifies the model to bind to the card
   */
  @Input() public prop?: string;
  /**
   * Card title
   */
  @Input() public title: string;
  /**
   * Card commands
   * @default []
   */
  @Input() public commands: ShBaseCommand[] = [];
  /**
   * Specifies whether the card should has confirm button
   * @default true
   */
  @Input() public hasConfirmButton = true;
  /**
   * Specifies whether the card should has cancel button
   * @default true
   */
  @Input() public hasCancelButton = true;
  /**
   * Specifies whether card body content is indented
   * @default true
   */
  @Input() public hasIndentedContent = true;
  /**
   * Specifies whether card body is scrollable
   * @default true
   */
  @Input() public isScrollable = true;
  /**
   * Observable of form validity
   */
  @Input() public isValid$: BehaviorSubject<boolean>;
  /**
  * Text used for cancel button
  * @default 'cancel'
  */
  @Input() public cancelText = 'cancel';
  /**
   * Text used for confirm button
   * @default 'confirm'
   */
  @Input() public confirmText = 'confirm';
  /**
   * Key that identifies commands family
   */
  @Input() public commandsFamily = 'card';
  /**
   * References to element for which card context scrolls itself
   */
  @Input() public scrollElement: HTMLElement | JQuery | string;
  /**
   * Cancel event
   */
  @Output() public cancel = new EventEmitter();
  /**
   * Confirm event
   */
  @Output() public confirm = new EventEmitter();
  /**
   * Event fired on model property changes
   */
  @Output() public valueChanges = new EventEmitter<T>();
  /**
   * Specifies whether the form is valid
   */
  public isValid: boolean;
  /**
   * The model form group
   */
  /*protected*/ public formGroup: ShFormGroup<any>;
  /**
   * Specifies whether the content of the card can be shown
   */
  /*protected*/ public isReady = false;
  /**
   * Change detector references
   */
  /*protected*/ public changeDetection: ChangeDetectorRef;

  /**
   * Card component
   */
  constructor(injector: Injector) {
    super(injector);
    this.changeDetection = injector.get(ChangeDetectorRef);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (isNoU(this.prop)) {
      this.formGroup = this.formHandler.getGroup(this.model);
    } else if (this.parent && this.prop in this.parent) {
      this.formGroup = this.formHandler.getGroup(this.prop, this.parent);
    } else {
      console.warn('Parent or prop is invalid. Unable to create form group.');
    }
    
    if (this.formGroup) {
      this.validityChanges(this.formGroup.valid);
    }
    this.formHandler.validityChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.validityChanges.bind(this));
    if (this.formGroup && this.valueChanges.observed) {
      this.formGroup.valueChanges
        .pipe(takeUntil(this.destroy$), distinctUntilChanged())
        .subscribe(v => this.valueChanges.emit(v));
    }
    yieldFunc(() => {
      this.isReady = true;
      if (shChangeDetectorStrategy() === ChangeDetectionStrategy.OnPush) {
        this.changeDetection.markForCheck();
      }
    });
  }

  public ngAfterViewInit() {
    if (this.isScrollable && this.scrollElement) {
      this.scrollTo(this.scrollElement);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    if (isNoU(this.prop)) {
      this.formHandler.removeGroup(this.model);
    } else {
      // undefined parent[prop] not supported, should throw error?
      this.formHandler.removeGroup(this.formGroup);
    }
  }

  /**
   * Scroll the card body context to the specified element
   * @param element The element for which scroll. It must be contained directly
   * into the container (not in a sub-element). The element can be the
   * reference to/the jquery reference to/the class-id of the html element
   */
  public scrollTo(element: HTMLElement | JQuery | string) {
    yieldFunc(() => {
      if (element instanceof HTMLElement || typeof element === 'string') {
        element = $(element as any);
      }
      const offset = element && element.offset();
      if (!isNoU(offset)) {
        $(`#${this.internalOptions.id}>.card-body`).animate({
          scrollTop: offset.top
        }, 'slow');
      }
    });
  }

  /**
   * Event fired on form validity changes
   * @param isValid Specifies whether the form is valid
   */
  private validityChanges(isValid: boolean) {
    yieldFunc(() => {
      this.isValid = isValid;
      if (!this.isValid$) {
        this.isValid$ = new BehaviorSubject(isValid);
      } else {
        this.isValid$.next(isValid);
      }
    });
  }

}
