import { Injector, OnInit, OnDestroy, Directive } from '@angular/core';
import { ICommand } from '../models/index';
import { CommandDispatcherService } from '../services/index';

@Directive()
export abstract class ShCommandComponent implements OnInit, OnDestroy {

  // Services
  commandDispatcher: CommandDispatcherService;

  public constructor(
    injector: Injector
  ) {
    this.commandDispatcher = injector.get(CommandDispatcherService);
  }

  public ngOnInit() {
    this.commandDispatcher.add(this);
  }

  public ngOnDestroy() {
    this.commandDispatcher.remove(this);
  }

  public shCommands() {
    return new Array<ICommand>();
  }

}
