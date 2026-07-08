import { ChangeDetectionStrategy, Component, Injector, Input, ViewEncapsulation } from '@angular/core';
import { CaepBaseAuthComponent } from '../../../base/base-auth.component';
import { ICaepTopbarItem } from '../../models';

@Component({
    selector: 'caep-topbar-button',
    templateUrl: './topbar-button.component.html',
    styleUrls: ['./topbar-button.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepTopbarButtonComponent extends CaepBaseAuthComponent<{}> {
  @Input() model: ICaepTopbarItem;
  constructor(injector: Injector) {
    super(injector);
  }
}
