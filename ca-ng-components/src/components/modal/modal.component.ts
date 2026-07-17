import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { isNoU, yieldFunc } from '../../utilities/common.utility';
import { IShBaseOptions, ShBaseAuthComponent } from './../base/index';

@Component({
  selector: 'sh-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShModalComponent<TValue = any> extends ShBaseAuthComponent<IShBaseOptions> implements OnInit {
  /**
   * If specified, the control try to reach a linked form-group to enable/disable
   * the confirm button (based on its validity)
   */
  @Input() public value: TValue;
  /**
   * If specified, the header title is flanked by an icon
   */
  @Input() public icon: string;
  /**
   * Header title.
   * Alternative: it's possible to use the content projection with title attribute
   * e.g.: <div title>sample title</div>
   */
  @Input() public title: string;
  /**
   * Body text.
   * Alternative: it's possible to use the content projection with body attribute
   * e.g.: <div title><component1></component1>...</div>
   */
  @Input() public body: string;
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
   * Specifies whether the modal should close on confirm
   * @default true
   */
  @Input() public closeOnConfirm = true;
  /**
   * Specifies whether the modal should close on cancel
   * @default true
   */
  @Input() public closeOnCancel = true;
  /**
   * Specifies whether the modal should close on click outside
   * @default true
   */
  @Input() public closeOnClickOutside = false;
  /**
   * Specifies whether the modal should has confirm button
   * @default true
   */
  @Input() public hasConfirmButton = true;
  /**
   * Specifies whether the modal should has cancel button
   * @default true
   */
  @Input() public hasCancelButton = true;
  /**
   * Binding which handles the toggling of the modal
   */
  @Input() public model: boolean;
  /**
   * Model change event
   */
  @Output() public modelChange = new EventEmitter<boolean>();
  /**
   * Cancel event
   */
  @Output() public cancel = new EventEmitter();
  /**
   * Confirm event
   */
  @Output() public confirm = new EventEmitter();
  /**
   * Form Group linked to a possible value
   */
  protected formGroup: FormGroup;
  /**
   * References to component element
   */
  private _element: ElementRef;
  /**
   * Specifies if view is initialized
   */
  private _isInitialized = false;

  /**
   * Modal component
   */
  constructor(injector: Injector) {
    super(injector);
    this._element = injector.get(ElementRef);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (!isNoU(this.value)) {
      this.formGroup = this.formHandler.getGroup(this.value);
    }
    $('body').append($(this._element.nativeElement));
    yieldFunc(() => this._isInitialized = true);
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    $(this._element.nativeElement).remove();
  }

  /**
   * Event fired when cancel button is pressed
   */
  public onCancel() {
    if (this.closeOnCancel) {
      this.close();
    }
    this.cancel.emit();
  }

  /**
   * Event fired when confirm button is pressed
   */
  protected onConfirm() {
    if (this.closeOnConfirm) {
      this.close();
    }
    this.confirm.emit();
  }

  /**
   * Event fired when user clicks outside the modal
   */
  public onClickOutside() {
    if (this._isInitialized && this.closeOnClickOutside) {
      this.close();
    }
  }

  /**
   * Invokes modal closing
   */
  private close() {
    this.modelChange.emit(this.model = false);
  }

}
