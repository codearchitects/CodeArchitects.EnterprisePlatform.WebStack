import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
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

  constructor(injector: Injector) {
    super(injector, (value?: ICaepTextOptions) => new CaepTextOptions(value));
  }

}
