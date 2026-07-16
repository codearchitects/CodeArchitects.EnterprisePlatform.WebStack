import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'caep-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepContainerComponent {
  //#region Internals
  private static _nextId = 0;
  //#endregion
  //#region View
  /**
   * Unique id of the main content region, used as the skip-link target.
   */
  protected readonly mainId = `caep-container-main-${CaepContainerComponent._nextId++}`;
  //#endregion
  //#region Inputs
  /**
   * Translation key for the "skip to main content" link.
   */
  @Input() public skipToMainLabel = 'skipToMain';
  /**
   * Optional accessible name for the main content landmark. When unset no
   * `aria-label` is rendered (a single `<main>` does not require a name).
   */
  @Input() public mainAriaLabel?: string;
  //#endregion
  //#region View hooks
  /**
   * Moves focus to the main content region when the skip link is activated,
   * without mutating the URL fragment.
   */
  protected onSkipToMain(event: Event, target: HTMLElement): void {
    event.preventDefault();
    target?.focus();
  }
  //#endregion
}
