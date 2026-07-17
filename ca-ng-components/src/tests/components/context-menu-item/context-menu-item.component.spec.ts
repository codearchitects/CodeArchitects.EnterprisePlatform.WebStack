import { RouterTestingModule } from '@angular/router/testing';
import { ShContextMenuItemComponent } from './../../../components/context-menu-item/context-menu-item.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShIconComponent } from '../../../components';
import { IdSequenceService } from '../../../services';

describe('ContexMenuItem component', () => {
  let component: ShContextMenuItemComponent;
  let fixture: ComponentFixture<ShContextMenuItemComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ShContextMenuItemComponent, ShIconComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShContextMenuItemComponent);
    component = fixture.debugElement.componentInstance;
    component.command = {};
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  describe('handle', () => {
    it('should not throw error if command has no handler', () => {
      component.command = {};
      expect(() => component['handle']()).not.toThrowError();
    });
    it('should call command handler passing command as argument', () => {
      const mockedHandler = jasmine.createSpy();
      const command = {
        name: 'myCommand',
        handler: mockedHandler,
      };
      component.command = command;

      component['handle']();

      expect(mockedHandler).toHaveBeenCalledTimes(1);
      expect(mockedHandler).toHaveBeenCalledWith(command);
    });
  });
});
