import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'caep-app-sidebar',
    templateUrl: './app-sidebar.component.html',
    styleUrls: ['./app-sidebar.component.scss'],
    host: {
      role: 'navigation',
      '[attr.aria-label]': 'ariaLabel || null'
    },
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepAppSidebarComponent implements OnInit {
  /**
   * Accessible name for the sidebar navigation landmark (WCAG 2.4.1 / EN 301 549).
   * Set this to a localized string so assistive technology can distinguish this
   * `navigation` region from other navigation landmarks on the page.
   */
  @Input() public ariaLabel: string | null = null;

  constructor() {}

  ngOnInit(): void {}
}
