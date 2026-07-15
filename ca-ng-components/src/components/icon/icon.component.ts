import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { CAEP_ICON_PREFIX_TOKEN } from './tokens/icon-prefix.token';
import { isNoU } from '../../utilities/common.utility';

@Component({
    selector: 'sh-icon',
    templateUrl: './icon.component.html',
    styles: [':host.disabled{ opacity: .5; pointer-events: none }'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShIconComponent implements OnChanges {
  /**
   * The name of the icon
   */
  @Input() public name: string;
  /**
   * Optional accessible label. When set, the icon is exposed to assistive
   * technology as role="img" with this label; otherwise the icon is treated
   * as decorative and hidden from assistive technology (aria-hidden).
   */
  @Input() public ariaLabel: string;
  /**
   * Icon prefix registered by token
   */
  protected iconPrefix: string = inject(CAEP_ICON_PREFIX_TOKEN, { optional: true });

  public ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['name'] && this.name != null) {
      this.name = !isNoU(this.iconPrefix) ? `${this.iconPrefix}${this.name}` : (this.name.indexOf('icon icon-') !== -1 ? this.name :  `icon icon-${this.name}`);
    }
  }
}
