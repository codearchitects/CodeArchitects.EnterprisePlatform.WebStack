import { TestBed, inject } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ICommand } from '../models/index';
import { Command } from '../decorators/index';
import { ShCommandComponent } from '../components/index';
import { CommandDispatcherService } from './command-dispatcher.service';

class MockRouter {
  public changes = new EventEmitter();
}

let mockRouter = new MockRouter();

class MockComponent extends ShCommandComponent {
  public shCommands() {
    return new Array<ICommand>({
      name: 'command1',
      label: 'Command 1',
      handler: (param1: string, param2: string) => `${param1} ${param2}!`
    });
  }

  @Command({
    name: 'command2',
    label: 'Command 2'
  })
  public method(param1: string, param2: string) {
    return `${param1} ${param2}!`;
  }
}

export function main() {
  describe('Command dispatcher', () => {

    let commandDispatcher: CommandDispatcherService;
    let mockComponent: MockComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: Router, useValue: mockRouter },
          CommandDispatcherService
        ]
      });
    });

    beforeEach(inject([CommandDispatcherService], (_commandDispatcher_: CommandDispatcherService) => {
      commandDispatcher = _commandDispatcher_;
      // mockComponent = new MockComponent(commandDispatcher);
    }));

    it('should return commands when component init', (done: Function) => {
      // Act
      commandDispatcher.changes
        .subscribe((commands: Array<ICommand>) => {
          // Assert
          expect(commands).toBeDefined();
          expect(commands.length).toBe(2);
          done();
        });
      // mockComponent.ngOnInit();
    });

    it('should return command result when command run', () => {
      // Act
      // mockComponent.ngOnInit();
      let result = commandDispatcher.run('command1', 'Hello', 'World');

      // Assert
      expect(result).toEqual('Hello World!');
    });
  });
}

describe('Command dispatcher tests', () => {
  it('should work', () => {});
});
