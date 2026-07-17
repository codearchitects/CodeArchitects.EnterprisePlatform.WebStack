import { Component, Injector, Input } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from '../base';

@Component({
  selector: 'sh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
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
