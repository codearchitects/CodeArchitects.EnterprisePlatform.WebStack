import { Component, ContentChild, ContentChildren, Inject, Injector, QueryList } from '@angular/core';
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

  constructor(injector: Injector, @Inject(CAEP_OPTIONS_TOKEN) optionsCtor: (value?: PickAll<O>) => O) {
    super(injector, optionsCtor);
  }
}
