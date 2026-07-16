import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, HostBinding, Injector, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';
import { IShBreadcrumbActivity } from '../breadcrumb/breadcrumb.component';
import { CaepPopoverService } from './service/popover.service';
import * as _ from 'lodash-es';

@Component({
    selector: 'sh-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShToolbarComponent extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Exposes the container as an APG `toolbar`. The projected controls
   * (back button, breadcrumb, language select and any `ng-content`) render
   * native focusable elements, so they stay individually tabbable. (WCAG 4.1.2)
   */
  @HostBinding('attr.role') public readonly role = 'toolbar';
  /**
   * Accessible name for the toolbar landmark (`aria-label`). Prefers a
   * consumer-supplied `ariaLabel`; otherwise falls back to a localized default.
   * `null` (attribute not rendered) when the toolbar is named via
   * `aria-labelledby` instead. (WCAG 4.1.2)
   */
  @HostBinding('attr.aria-label') public get toolbarAriaLabel(): string | null {
    if (this.ariaLabelledBy) {
      return null;
    }
    return this.ariaLabel ?? this._translateService.instant('toolbar');
  }
  /**
   * Id(s) of the element(s) labelling the toolbar (`aria-labelledby`).
   * `null` when unset so nothing is rendered. (WCAG 1.3.1 / 4.1.2)
   */
  @HostBinding('attr.aria-labelledby') public get toolbarAriaLabelledBy(): string | null {
    return this.ariaLabelledBy ?? null;
  }
  /**
   * Specifies whether toolbar can show back button
   * @default true
   */
  @Input() public showBackButton = true;
  /**
   * Specifies whether toolbar can show breadcrumb
   * @default true
   */
  @Input() public showBreadcrumb = true;
  /**
   * Specifies whether toolbar can show languages control
   * @default true
   */
  @Input() public showLangControl = true;
  /**
   * Application activity
   */
  @Input() public activity: IShBreadcrumbActivity;
  /**
   * Event fired on back button clicked
   */
  @Output() public return = new EventEmitter();
  /**
   * Current language
   */
  /*protected*/ public currentLang: string;
  /**
   * i18n: List of available languages
   */
  /*protected*/ public langs: string[];
  /**
   * Uppercase pipe
   */
  /*protected*/ public upperCasePipe = new UpperCasePipe();
  /**
   * Translate Service
   */
  private _translateService: TranslateService;
  /**
   * Popover Service
   */
  private _popoverService: CaepPopoverService<string>;
  /**
   * Toolbar component
   */
  constructor(injector: Injector) {
    super(injector);
    this._translateService = injector.get(TranslateService);
    this._popoverService = injector.get(CaepPopoverService);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.currentLang = this._translateService.currentLang;
    this._popoverService.addLangs(this._translateService.langs);
    this._popoverService.langs$.pipe(takeUntil(this.destroy$)).subscribe((langs: string[]) => {
      this.langs = langs;
    });
    this._translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => this.currentLang = e.lang);
  }

  /**
   * Event fired when language is changed
   * @param lang New language
   */
  /*protected*/ public onLangChanges(lang: string) {
    this._translateService.use(lang);
    this.currentLang = this._translateService.currentLang;
  }
}
