import { Injectable, EventEmitter } from '@angular/core';
import { MetadataHelpers } from '@ca-webstack/reflection';
import { CommandKey } from '../decorators/index';
import { ICommand } from '../models/index';
import { ShCommandComponent } from '../components/index';

/**
 * Command dispatcher implementation.
 *
 * ### Example
 * ```
 * import {
 *   CommandDispatcher,
 *   ICommand,
 *   ShCommandComponent
 * } from 'ca-ng-command-dispatcher'
 *
 * class MyComponent extends ShCommandComponent {
 *   public constructor (
 *     private commandDispatcher: CommandDispatcher
 *   ) {
 *     super(commandDispatcher);
 *   }
 *
 *   public shCommands() {
 *     return new Array<ICommand>({
 *       // command property
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class CommandDispatcherService {

  /**
   * Command dispatcher changes event emitter.
   *
   *
   * ### Example
   * ```
   * commandDispatcher.changes.subscribe((command: Array<ICommand>) => {
   *   // use commands
   * })
   * ```
   */
  public changes = new EventEmitter<ICommand[]>();

  private components = new Array<ShCommandComponent>();

  /**
   * Add command to command dispatcher.
   *
   * @param component - Component from which to extract the commands.
   */
  public add(component: ShCommandComponent) {
    this.components = [...this.components, component];
    this.emitChange();
  }

  /**
   * Remove command from command dispatcher.
   *
   * @param component - Component from which to extract the commands.
   */
  public remove(component: ShCommandComponent) {
    this.components = this.components.filter((c) => c !== component);
    this.emitChange();
  }

  /**
   * Run a command.
   *
   * @param component - Component from which to run the commands.
   * @param command - Command to run.
   * @param params - Params of the command.
   * @return Return value of the command handler.
   */
  public run(commandName: string, ...params: Array<any>) {
    const command = this.components
      .map((component) => this.getCommands(component))
      .reduce((memo, commands) => memo.concat(commands), new Array<ICommand>())
      .reduce((memo, command) => command.name === commandName ? command : memo, <ICommand>undefined);
    return command && command.handler(...params);
  }

  /**
   * Refreshes commands
   */
  public apply() {
    this.emitChange();
  }

  private emitChange() {
    const commands = this.components
      .reduce((memo, component) => [...memo, ...this.getCommands(component)], new Array<ICommand>());
    this.changes.emit(commands);
  }

  private getCommands(component: ShCommandComponent) {
    let commands = component.shCommands();

    for (const prop in component) {
      const command = MetadataHelpers.getMetadata<ICommand>(CommandKey, component, prop);
      if (command) {
        if (typeof command.visible === 'string') {
          command.visible = (component as any)[command.visible];
        } else {
          command.visible = command.visible === undefined ? true : command.visible;
        }
        if (typeof command.enabled === 'string') {
          command.enabled = (component as any)[command.enabled];
        } else {
          command.enabled = command.enabled === undefined ? true : command.enabled;
        }
        commands = [...commands, command];
      }
    }

    // This map is essential because function binding is applicable only one time
    return commands
      .map((command) => Object.assign({}, command, { handler: command.handler.bind(component) }));
  }
}
