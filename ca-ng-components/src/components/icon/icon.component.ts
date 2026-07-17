import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';

@Component({
  selector: 'sh-icon',
  templateUrl: './icon.component.html',
  styles: [':host.disabled{ opacity: .5; pointer-events: none }'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShIconComponent implements OnChanges {
  /**
   * The name of the icon
   */
  @Input() public name: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['name']) {
      this.name = `icon icon-${this.name}`;
    }
  }
}
