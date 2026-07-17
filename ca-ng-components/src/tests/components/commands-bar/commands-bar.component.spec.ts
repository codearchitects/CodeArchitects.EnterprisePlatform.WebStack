import { ShCommandsBarComponent } from './../../../components/commands-bar/commands-bar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';

describe('CommandsBar component', () => {
  let component: ShCommandsBarComponent;
  let fixture: ComponentFixture<ShCommandsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShCommandsBarComponent],
      providers: [IdSequenceService, CommandDispatcherService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShCommandsBarComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
  });
  describe('constructor', () => {
    it('should initialize commands to empty array', () => {
      expect(component['commands']).toEqual([]);
    });
    it('should set commandDispatcher', () => {
      expect(component['_commandDispatcher']).toBeDefined();
      expect(component['_commandDispatcher']).not.toBeNull();
      expect(component['_commandDispatcher'] instanceof CommandDispatcherService).toBeTruthy();
    });
  });
  describe('ngOnInit', () => {
    it('should set isReady to true', () => {
      component['isReady'] = false;

      component.ngOnInit();

      expect(component['isReady']).toBeTruthy();
    });
    it('should call commandDispatcher apply', () => {
      const applySpy = spyOn(component['_commandDispatcher'], 'apply');

      component.ngOnInit();

      expect(applySpy).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to commandDispatcher changes', () => {
      component['destroy$'].next();

      expect(component['_commandDispatcher'].changes.observers.length).toEqual(0);

      component.ngOnInit();

      expect(component['_commandDispatcher'].changes.observers.length).toEqual(1);
    });
    describe('commandDispatcher changes subscription', () => {
      it('should do nothing when subscription emits an undefined or null value', () => {
        const startingCommands = [{ name: 'fakeCommand' }];
        component['commands'] = startingCommands;

        component['_commandDispatcher'].changes.next(null);

        expect(component['commands']).toEqual(startingCommands);
      });
      it('should set commands to emit array if no family has been set', () => {
        const expectedCommands = [{ name: 'realCommand' }];
        component['commands'] = [{ name: 'fakeCommand' }];
        component.family = undefined;

        component['_commandDispatcher'].changes.next(expectedCommands);

        expect(component['commands']).toEqual(expectedCommands);
      });
      it('should filter commands by family when family is set', () => {
        const filterFamily = 'row';
        const emitCommands = [
          { name: 'command1', family: filterFamily },
          { name: 'command2', family: 'column' },
          { name: 'command3', family: filterFamily },
          { name: 'command4', family: 'column' },
          { name: 'command5', family: 'grid' },
        ];
        // filtering commands by family
        const expectedCommands = emitCommands.filter(cmd => cmd.family === filterFamily);
        component.family = filterFamily;
        expect(component['commands']).toEqual([]);

        component['_commandDispatcher'].changes.next(emitCommands);

        expect(component['commands']).toEqual(expectedCommands);
      });
    });
  });
});
