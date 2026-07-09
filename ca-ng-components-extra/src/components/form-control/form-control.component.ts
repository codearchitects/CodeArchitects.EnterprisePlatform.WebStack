import { Component, Inject, Injector, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { takeUntil } from 'rxjs/operators';
import { CaepHook, CaepHookType } from '../../decorators';
import { CaepValueChange } from '../../models';
import { CAEP_OPTIONS_TOKEN } from '../../tokens';
import { PickAll, yieldFunc } from '../../utilities';
import { CaepBaseModelComponent, CaepBaseOptions } from '../base';
import { CaepTemplateComponent } from '../template/template.component';

/**
 * Form Control options contract
 */
/*export interface IShFormControlOptions<T>
  extends IShLabelOptions, IShBaseInputOptions<T>, IShValidatorMessageOptions {
  values: any
}*/

/**
 * Component which reads value decorators and
 * applies template and validations dynamically
 */
@Component({
    selector: 'caep-form-control',
    templateUrl: './form-control.component.html',
    providers: [
        {
            provide: CAEP_OPTIONS_TOKEN,
            useValue: (value?: any) => new CaepBaseOptions(value)
        }
    ],
    standalone: false
})
export class CaepFormControlComponent<T, O extends CaepBaseOptions = CaepBaseOptions> extends CaepBaseModelComponent<
  T,
  O
> {
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
  private _aspectHelper: AspectHelper;

  /**
   * Hiding flag of CaepValidationMessageComponent
   */
  public isCaptionControl: boolean;

  /**
   * Component which reads value decorators and
   * applies template and validations dynamically
   */
  constructor(injector: Injector, @Inject(CAEP_OPTIONS_TOKEN) optionsCtor: (value?: PickAll<O>) => O) {
    super(injector, optionsCtor);
    this._contextService = injector.get(ContextService);
    this._aspectHelper = injector.get(AspectHelper);
    this._contextService.contextChange.pipe(takeUntil(this.destroy$)).subscribe(context => {
      this.isReady = false;
      yieldFunc(() => (this.isReady = true));
    });
  }

  public giveFocus() {
    const template = this.controlRef as unknown as CaepTemplateComponent<T, any>;
    template?.giveFocus();
  }

  /**
   * canValueChange event handler
   * @param valueChange CaepValueChange object containing value change request
   */
  public onCanValueChange(valueChange: CaepValueChange<T>) {
    if (this.canValueChange.observed) this.canValueChange.emit(valueChange);
    else valueChange.authorize();
  }

  /**
   * Updates isCaptionControl flag on model change
   * @param changes SimpleChanges object containing model change
   */
  @CaepHook({ type: CaepHookType.Change })
  private onModelChange(changes: SimpleChanges) {
    if (changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.isCaptionControl =
        this._aspectHelper.getTemplate(this.model, this.prop, this._contextService.context)?.toUpperCase() ===
        'CAPTION';
    }
  }
}
