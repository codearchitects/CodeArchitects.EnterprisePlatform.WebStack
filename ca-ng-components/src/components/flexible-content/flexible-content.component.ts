import { Component, Input } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';

@Component({
  selector: 'sh-flexible-content',
  templateUrl: './flexible-content.component.html',
  styleUrls: ['./flexible-content.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Flexible component that offers three zones
 * configurables with custom content.
 * Zones reachables by following attributes:
 * - left-zone
 * - right-zone
 * - center-zone
 */
export class ShFlexibleContentComponent {
  /**
   * Text contained into first zone
   */
  @Input() text: string;

  /**
   * Flexible component that offers three zones
   * configurables with custom content.
   * Zones reachables by following attributes:
   * - left-zone
   * - right-zone
   * - center-zone
   */
  constructor() { }
}
