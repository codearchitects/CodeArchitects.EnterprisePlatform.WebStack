import { Component, ContentChild, ContentChildren, Inject, Injector, Input, QueryList } from '@angular/core';
import { Validators } from '@angular/forms';
import { CaepContentChild, CaepContentChildren, CaepOption } from '../../decorators';
import { caepChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { CAEP_OPTIONS_TOKEN } from '../../tokens';
import { PickAll } from '../../utilities';
import { CaepBaseInputComponent, CaepBaseInputOptions } from '../base';
import { CaepOptionComponent } from '../option/option.component';

export interface IMockTextOptions extends PickAll<MockTextOptions> {}

export class MockTextOptions extends CaepBaseInputOptions<string> {
  @CaepOption({ defaultValue: 'text' })
  type?: 'text' | 'password' | 'email';

  constructor(options?: IMockTextOptions) {
    super(options);
  }
}

@Component({
    selector: 'caep-mock-text',
    templateUrl: './mock-text.component.html',
    changeDetection: caepChangeDetectorStrategy(),
    providers: [
        {
            provide: CAEP_OPTIONS_TOKEN,
            useValue: (value?: any) => new MockTextOptions(value)
        }
    ],
    standalone: false
})
export class MockTextComponent<O extends MockTextOptions = MockTextOptions> extends CaepBaseInputComponent<string, O> {
  @CaepContentChild(CaepOptionComponent)
  @ContentChild(CaepOptionComponent)
  public firstOption: CaepOptionComponent<string>;

  /*@CaepContentChild(MockTextComponent)
  @ContentChild(MockTextComponent)
  public testIncorrectSelector: MockTextComponent;*/

  @CaepContentChildren(CaepOptionComponent, { descendants: true })
  @ContentChildren(CaepOptionComponent, { descendants: true })
  public testDescendants: QueryList<CaepOptionComponent<string>>;

  /**
   * Accessible name for the input, used when no visible associated label is present.
   * Bound to the input's `aria-label` attribute for assistive technologies (WCAG 4.1.2 / 3.3.2).
   */
  @Input() public ariaLabel?: string;

  constructor(injector: Injector, @Inject(CAEP_OPTIONS_TOKEN) optionsCtor: (value?: PickAll<O>) => O) {
    super(injector, optionsCtor);
  }

  /**
   * Whether the underlying form control carries a `required` validator, so the input can
   * reflect it via `aria-required` for assistive technologies (WCAG 3.3.2).
   */
  public isAriaRequired(): boolean {
    return !!this.formControl && this.formControl.hasValidator(Validators.required);
  }
}
