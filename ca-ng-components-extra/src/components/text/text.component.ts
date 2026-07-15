import { ChangeDetectionStrategy, Component, Injector, Input, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { Mstring } from '@ca-webstack/ng-i18n';
import { CaepBaseInputComponent } from '../base';
import { CaepTextOptions, ICaepTextOptions } from './text-options.type';

@Component({
    selector: 'caep-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class CaepTextComponent extends CaepBaseInputComponent<string, ICaepTextOptions> {

  /**
   * Accessible name for the input, used only when no visible `label` is set.
   * Provides a programmatic name for assistive technologies (WCAG 4.1.2).
   */
  @Input() public ariaLabel?: string | Mstring;

  /**
   * Whether the underlying control has a `required` validator.
   * Returns `true` when required, otherwise `null` so `aria-required` is not rendered.
   */
  public get isRequired(): true | null {
    return this.formControl?.hasValidator(Validators.required) ? true : null;
  }

  constructor(injector: Injector) {
    super(injector, (value?: ICaepTextOptions) => new CaepTextOptions(value));
  }

}
