import { ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { CaepBaseAuthComponent } from '../../../base/base-auth.component';
import { ICaepTopbarItem } from '../../models';

@Component({
    selector: 'caep-topbar-item',
    templateUrl: './topbar-item.component.html',
    styleUrls: ['./topbar-item.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepTopbarItemComponent extends CaepBaseAuthComponent<{}> implements OnInit {
  @Input() model: Omit<ICaepTopbarItem, 'containerClass'> & { containerClass?: Observable<string | string[]> };
  constructor(injector: Injector) {
    super(injector);
  }
}
