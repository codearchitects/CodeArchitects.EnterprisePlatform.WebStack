import { Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { Mstring } from '@ca-webstack/ng-i18n';
import * as _ from 'lodash-es';
import { IShBaseOptions, ShBaseModelComponent } from '../base/index';

/**
 * Label component options contract
 */
export interface IShLabelOptions
  extends IShBaseOptions {
  label?: string | boolean | Mstring;
  labelClass?: string[];
}

@Component({
    selector: 'sh-label',
    templateUrl: './label.component.html',
    standalone: false
})
/**
 * Base Label component
 */
export class ShLabelComponent<T, O extends IShLabelOptions>
  extends ShBaseModelComponent<T, O>
  implements OnChanges {
  /**
   * Aspect Helpers
   */
  /*protected*/ public aspectHelper: AspectHelper;
  /**
   * Label to show
   */
  /*protected*/ public label: string | boolean | Mstring;
  /**
   * Context Service
   */
  private _contextService: ContextService;
  /**
  * Base Label component
  */
  constructor(injector: Injector) {
    super(injector);
    this.aspectHelper = injector.get(AspectHelper);
    this._contextService = injector.get(ContextService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    this.label = <string>this.aspectHelper.getLabel(this.model, this.prop, this._contextService.context);
    if (this.internalOptions) {
      this.label = this.internalOptions.label !== undefined ? this.internalOptions.label : this.label;
    }
  }

  /*protected*/ public getDefaultOptions(): IShLabelOptions {
    return _.merge(super.getDefaultOptions(), {
      labelClass: []
    });
  }

}
