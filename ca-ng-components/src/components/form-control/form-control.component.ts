import { ShTemplateComponent } from './../template/template.component';
import { Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { takeUntil } from 'rxjs/operators';
import { yieldFunc } from '../../utilities';
import { IShBaseInputOptions, ShBaseModelComponent } from '../base/index';
import { IShLabelOptions } from '../label/label.component';
import { IShValidatorMessageOptions } from '../validation-message/validation-message.component';

/**
 * Form Control options contract
 */
export interface IShFormControlOptions<T>
  extends IShLabelOptions, IShBaseInputOptions<T>, IShValidatorMessageOptions {
  values: any
}

@Component({
    selector: 'sh-form-control',
    templateUrl: './form-control.component.html',
    standalone: false
})
/**
 * Component which reads value decorators and
 * applies template and validations dynamically
 */
export class ShFormControlComponent<T>
  extends ShBaseModelComponent<T, IShFormControlOptions<T>> implements OnChanges {
  /**
   * Specifies whether component is ready to be used
   */
  /*protected*/ public isReady = true;
  /**
   *  Specifies whether dynamically created control is Caption. Hiding flag of ShValidationMessageComponent
   */;
  public isCaptionControl: boolean;
  public giveFocus() {
    const template = this.controlRef as unknown as ShTemplateComponent<T, any>;
    template?.giveFocus();
  }
  /**
   * Context Service
   */
  private _contextService: ContextService;
  /**
   * Aspect Helper service
   */
  private _aspectHelper: AspectHelper;
  /**
   * Component which reads value decorators and
   * applies template and validations dynamically
   */
  constructor(injector: Injector) {
    super(injector);
    this._contextService = injector.get(ContextService);
    this._aspectHelper = injector.get(AspectHelper);
    this._contextService.contextChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(context => {
        this.isReady = false;
        this.isCaptionControl = this._aspectHelper.getTemplate(this.model, this.prop, context)?.toUpperCase() === 'CAPTION';
        yieldFunc(() => this.isReady = true);
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if(changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.isCaptionControl = this._aspectHelper.getTemplate(this.model, this.prop, this._contextService.context)?.toUpperCase() === 'CAPTION';
    }
  }

  /**
   * The rendered `<sh-label>` is a sibling of the dynamic control, not an
   * ancestor `<label>` wrapping it, and its `for` targets whatever native
   * input the control happens to expose (e.g. Toggle's hidden checkbox, not
   * the real `role="switch"` element). Point the control at the label
   * explicitly via `aria-labelledby` (matching the id `<sh-label>` renders)
   * so custom ARIA widgets get a real accessible name too (WCAG 4.1.2),
   * unless a caller already supplied their own ariaLabelledBy/ariaLabel.
   */
  public onOptionsChanges() {
    super.onOptionsChanges();
    if (this.internalOptions.ariaLabelledBy === undefined && this.internalOptions.ariaLabel === undefined
      && this.internalOptions.label !== false) {
      this.internalOptions.ariaLabelledBy = `${this.internalOptions.id}-label`;
    }
  }

}
