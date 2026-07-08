import { Component, OnInit, Injector, Input, inject, ContentChild, TemplateRef } from '@angular/core';
import { CommandDispatcherService, ICommand } from '@ca-webstack/ng-command-dispatcher';
import { ShBaseComponent, IShBaseOptions } from '../base';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sh-commands-bar',
    templateUrl: './commands-bar.component.html',
    standalone: false
})
export class ShCommandsBarComponent extends ShBaseComponent<IShBaseOptions> implements OnInit {
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

  constructor(injector: Injector) {
    super(injector);
    this._commandDispatcher = injector.get(CommandDispatcherService);
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
