import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { ShBaseCommand } from '../../models/command';
import { FormHandlerService } from 'src/services/form-handler.service';
import { isNoU, yieldFunc } from 'src/utilities/common.utility';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
  selector: 'sh-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShCardComponent<T> extends ShBaseAuthComponent<IShBaseOptions> implements OnInit, AfterViewInit {
  /**
   * The object binded to the card (for validations)
   * @default {}
   */
  @Input() public model: T = {} as any;
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
  protected formGroup: FormGroup;
  /**
   * Specifies whether the content of the card can be shown
   */
  public isReady = false;
  /**
   * Change detector references
   */
  protected changeDetection: ChangeDetectorRef;

  /**
   * Card component
   */
  constructor(injector: Injector) {
    super(injector);
    this.changeDetection = injector.get(ChangeDetectorRef);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.formHandler.getGroup(this.model);
    if (this.formGroup) {
      this.validityChanges(this.formGroup.valid);
    }
    this.formHandler.validityChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.validityChanges.bind(this));
    if (this.formGroup && this.valueChanges.observers && this.valueChanges.observers.length) {
      this.formGroup.valueChanges
        .pipe(takeUntil(this.destroy$), distinctUntilChanged())
        .subscribe(v => this.valueChanges.emit(v));
    }
    yieldFunc(() => {
      this.isReady = true;
      if (SH_CHANGE_DETECTOR.STRATEGY === ChangeDetectionStrategy.OnPush) {
        this.changeDetection.markForCheck();
      }
    });
  }

  public ngAfterViewInit() {
    if (this.isScrollable && this.scrollElement) {
      this.scrollTo(this.scrollElement);
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
