import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShComboComponent, ShIconComponent } from '../../../components';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ShSidebarSearchComponent } from '../../../components/sidebar-search/sidebar-search.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetsService, IdSequenceService } from '../../../services';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('SidebarSearch component', () => {
  let component: ShSidebarSearchComponent;
  let fixture: ComponentFixture<ShSidebarSearchComponent>;
  let htmlElement: HTMLDivElement;

  const mockedGet = jasmine.createSpy();
  const mockedAssetsService = new AssetsService({
    get: () => null
  } as any);
  mockedAssetsService.get = mockedGet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot(), RouterTestingModule, I18nModule],
      declarations: [ShSidebarSearchComponent, ShIconComponent, ShComboComponent],
      providers: [
        IdSequenceService,
        { provide: AssetsService, useValue: mockedAssetsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSidebarSearchComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { name: 'command' } as any;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set router', () => {
      expect(component['_router']).toBeDefined();
      expect(component['_router']).not.toBeNull();
      expect(component['_router']).toBeInstanceOf(Router);
    });
    it('should set assetsService', () => {
      expect(component['_assetsService']).toBeDefined();
      expect(component['_assetsService']).not.toBeNull();
      expect(component['_assetsService']).toBeInstanceOf(AssetsService);
    });
  });

  it('ngOnInit should set combo properly', async(() => {
    fixture.whenStable().then(async () => {
      const fakeCommands = [{ name: 'command1' }, { name: 'command2' }] as any;
      const getIndexableCommandsSpy = spyOn(component as any, 'getIndexableCommands').and.returnValue(fakeCommands);
      mockedGet.and.returnValue(fakeCommands);
      mockedGet.calls.reset();

      await component.ngOnInit();

      expect(mockedGet).toHaveBeenCalledTimes(1);
      expect(mockedGet).toHaveBeenCalledWith('sidebar.json', true);
      expect(getIndexableCommandsSpy).toHaveBeenCalledTimes(1);
      expect(getIndexableCommandsSpy).toHaveBeenCalledWith(fakeCommands);
      expect(component['combo'].values).toEqual(fakeCommands);
      expect(component['combo'].valuesPipe.transform).toBeDefined();
      expect(component['combo'].minChars).toEqual(1);
      expect(component['combo'].placeholder).toEqual('search-something');
    });
  }));

  it('ShSidebarSearchPipe should return command title', async(() => {
    fixture.whenStable().then(() => {
      const expectedTitle = 'myTitle';
      const fakeCommand: any = { title: expectedTitle };

      expect(component['combo'].valuesPipe.transform(fakeCommand)).toEqual(expectedTitle);
    });
  }));

  describe('onChange', () => {
    it('should not throw error if value is undefined or null', () => {
      expect(() => component['onChange'](null)).not.toThrowError();
    });
    it('should emit change and set value', () => {
      const model: any = { name: 'command1' };
      const newModel: any = { name: 'command1', routerLink: [] };
      const emitSpy = spyOn(component.modelChange, 'emit');
      spyOn(component['_router'], 'navigate');
      component.model = model;
      component.applicationName = 'foo';

      component['onChange'](newModel);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(newModel);
      expect(component.model).toEqual(newModel);
    });
    it('should call router navigate when applicationName is set', () => {
      const model: any = { name: 'command1' };
      const newModel: any = { name: 'command1', routerLink: ['a', 'b'] };
      const applicationName = 'myApp';
      const navigateSpy = spyOn(component['_router'], 'navigate');
      component.model = model;
      component.applicationName = applicationName;

      component['onChange'](newModel);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([applicationName, newModel.routerLink[0], newModel.routerLink[1]]);
    });
    it('should throw error when applicationName is not set', () => {
      const model: any = { name: 'command1' };
      const newModel: any = { name: 'command1Updated' };
      component.model = model;
      component.applicationName = undefined;

      expect(() => component['onChange'](newModel)).toThrowError('Please gives to the component the applicationName input');
    });
  });

  it('getIndexableCommands should return commands which hasIndex is set to true', () => {
    const fakeCommand2 = { name: 'command2', hasIndex: true };
    const fakeCommand1 = { name: 'command1', children: [fakeCommand2] };
    const fakeCommand4 = { name: 'command4' };
    const fakeCommand5 = { name: 'command4', hasIndex: true };
    const fakeCommand3 = { name: 'command3', hasIndex: true, children: [fakeCommand4, fakeCommand5] };
    const fakeCommands: any[] = [fakeCommand1, fakeCommand3];

    const result = component['getIndexableCommands'](fakeCommands);

    expect(result.length).toEqual(3);
    expect(result).toEqual([fakeCommand2, fakeCommand5, fakeCommand3] as any);
  });

});
