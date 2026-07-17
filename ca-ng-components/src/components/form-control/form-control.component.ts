import { Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { takeUntil } from 'rxjs/operators';
import { yieldFunc } from 'src/utilities';
import { IShBaseInputOptions, ShBaseModelComponent } from '../base/index';
import { IShLabelOptions } from '../label/label.component';
import { IShValidatorMessageOptions } from '../validation-message/validation-message.component';

/**
 * Form Control options contract
 */
export interface IShFormControlOptions<T>
  extends IShLabelOptions, IShBaseInputOptions<T>, IShValidatorMessageOptions { }

@Component({
  selector: 'sh-form-control',
  templateUrl: './form-control.component.html'
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
  public isReady = true;
  /**
   * Context Service
   */
  private _contextService: ContextService;
  /**
   * Aspect Helper service
   */
  private _aspectHelper: AspectHelper
  /**
   *  Specifies whether dynamically created control is Caption. Hiding flag of ShValidationMessageComponent
   */
  public isCaptionControl: boolean;

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
        const template = this._aspectHelper.getTemplate(this.model, this.prop, context);
        this.isCaptionControl = template && template.toUpperCase() === 'CAPTION';
        yieldFunc(() => this.isReady = true);
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const modelChanges = changes['model'];
    if (modelChanges && !this.isChangeEqual(modelChanges)) {
      const template = this._aspectHelper.getTemplate(this.model, this.prop, this._contextService.context);
      this.isCaptionControl = template && template.toUpperCase() === 'CAPTION';
    }
  }

}
