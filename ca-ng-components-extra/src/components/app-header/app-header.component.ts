import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'caep-app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepAppHeaderComponent implements OnInit {
  /**
   * Optional accessible name for the banner landmark. Useful when a page
   * exposes more than one `role="banner"` region and they must be
   * distinguished by assistive technology. Renders no attribute when unset.
   */
  @Input() ariaLabel?: string;

  constructor() {}

  ngOnInit(): void {}
}
