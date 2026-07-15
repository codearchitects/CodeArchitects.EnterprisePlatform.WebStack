import { Component, OnInit, Injector, Input, inject, ContentChild, TemplateRef, HostBinding } from '@angular/core';
import { CommandDispatcherService, ICommand } from '@ca-webstack/ng-command-dispatcher';
import { TranslateService } from '@ngx-translate/core';
import { ShBaseComponent, IShBaseOptions } from '../base';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sh-commands-bar',
    templateUrl: './commands-bar.component.html',
    standalone: false
})
export class ShCommandsBarComponent extends ShBaseComponent<IShBaseOptions> implements OnInit {
  /**
   * Exposes the container as an APG `toolbar`. The projected command controls
   * render native focusable elements (buttons), so they stay individually
   * tabbable; no roving tabindex is required. (WCAG 4.1.2)
   */
  @HostBinding('attr.role') public readonly role = 'toolbar';
  /**
   * Accessible name for the toolbar (`aria-label`). Prefers a consumer-supplied
   * `ariaLabel`; otherwise falls back to a localized default. `null` (attribute
   * not rendered) when the toolbar is named via `aria-labelledby` instead.
   * (WCAG 4.1.2)
   */
  @HostBinding('attr.aria-label') public get toolbarAriaLabel(): string | null {
    if (this.ariaLabelledBy) {
      return null;
    }
    return this.ariaLabel ?? this._translateService.instant('commands-bar');
  }
  /**
   * Id(s) of the element(s) labelling the toolbar (`aria-labelledby`).
   * `null` when unset so nothing is rendered. (WCAG 1.3.1 / 4.1.2)
   */
  @HostBinding('attr.aria-labelledby') public get toolbarAriaLabelledBy(): string | null {
    return this.ariaLabelledBy ?? null;
  }
  /**
   * Id(s) of the element(s) describing the toolbar (`aria-describedby`).
   * `null` when unset. (WCAG 1.3.1)
   */
  @HostBinding('attr.aria-describedby') public get toolbarAriaDescribedBy(): string | null {
    return this.ariaDescribedBy ?? null;
  }
  /**
   * Commands family
   */
  @Input() public family: string;
  /**
   * Command template identified by #commandsTemplate
   */
  @ContentChild('commandsTemplate')
  public templateRef: TemplateRef<HTMLElement>;
  /**
   * Dispatched commands
   */
  /*protected*/ public commands: ICommand[] = [];
  /**
   * Specifies whether component is ready to be used
   */
  /*protected*/ public isReady = false;
  /**
   * Command dispatcher service
   */
  private _commandDispatcher: CommandDispatcherService;
  /**
   * Translation service used to localize the toolbar accessible name
   */
  private _translateService: TranslateService;

  constructor(injector: Injector) {
    super(injector);
    this._commandDispatcher = injector.get(CommandDispatcherService);
    this._translateService = injector.get(TranslateService);
  }

  public ngOnInit() {
    super.ngOnInit();
    this._commandDispatcher.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(cmds => {
        if (cmds) {
          this.commands = this.family
            ? cmds.filter(cmd => cmd && cmd.family === this.family)
            : cmds;
        } else {
          cmds = [];
        }
      });
    this._commandDispatcher.apply();
    this.isReady = true;
  }

}
