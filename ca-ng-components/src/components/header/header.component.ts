import { Component, Injector, Input } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from '../base';
import { CAEP_SIDEBAR_SEARCH_DEFAULT_ICON } from '../../utilities/common.utility';

@Component({
    selector: 'sh-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false,
    host: {
        'role': 'banner',
        '[attr.aria-label]': 'ariaLabel',
        '[attr.aria-labelledby]': 'ariaLabelledBy',
        '[attr.aria-describedby]': 'ariaDescribedBy'
    }
})
export class ShHeaderComponent extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Logo assets path (e.g.: "logo_app.png")
   * The image must have a height of 30px to fit content correctly
   */
  @Input() public logo: string;
  /**
   * Specifies whether header can show searchbar (sidebar based)
   * @default true
   */
  @Input() showSearchbar = true;
  /**
   * Search bar's icon name
   * @default 'search'
   */
  @Input() public searchBarIcon: string = CAEP_SIDEBAR_SEARCH_DEFAULT_ICON;
  /**
   * The application name
   */
  @Input() public applicationName: string;
  /**
   * Section header component
   */
  constructor(injector: Injector) {
    super(injector);
  }
}
