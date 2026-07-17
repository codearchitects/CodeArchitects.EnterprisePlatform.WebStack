import { IContextMenuCommand } from './../../../components/context-menu/context-menu.component';
import { ShComponentsModule } from './../../../components/components.module';
import { ShContextMenuComponent } from '../../../components/context-menu/context-menu.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuService } from 'ngx-contextmenu';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { ShBaseAuthComponent } from '../../../components';

describe('ContextMenu component', () => {
  let component: ShContextMenuComponent;
  let fixture: ComponentFixture<ShContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule],
      providers: [ContextMenuService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShContextMenuComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
  });
  it('should initialize commands to empty array', () => {
    expect(component.commands).toEqual([]);
  });
  describe('ngOnChanges', () => {
    it('should call super ngOnChanges', () => {
      const changes: SimpleChanges = {
        'aChange': new SimpleChange(undefined, null, false)
      };
      const parentClassSpy = spyOn(ShBaseAuthComponent.prototype, 'ngOnChanges');

      component.ngOnChanges(changes);

      expect(parentClassSpy).toHaveBeenCalledTimes(1);
      expect(parentClassSpy).toHaveBeenCalledWith(changes);
    });
    it('should set enable and show for all commands', () => {
      const commands: IContextMenuCommand[] = [
        {
          name: 'command1'
        },
        {
          name: 'command2',
          enable: false
        },
        {
          name: 'command3',
          show: false
        }
      ];
      const changes: SimpleChanges = {
        'commands': new SimpleChange([], commands, false)
      };
      component.commands = commands;

      component.ngOnChanges(changes);

      expect(commands[0].enable).toBeTruthy();
      expect(commands[0].show).toBeTruthy();
      expect(commands[1].enable).toBeFalsy();
      expect(commands[1].show).toBeTruthy();
      expect(commands[2].enable).toBeTruthy();
      expect(commands[2].show).toBeFalsy();
    });
  });
});
