import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
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
