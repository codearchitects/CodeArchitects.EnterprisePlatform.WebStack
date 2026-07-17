import { SH_CHANGE_DETECTOR } from './../../../environments/change-detection-strategy';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ShIconComponent, ShSidebarItemComponent } from './../../../components';
import { ShSidebarComponent } from '../../../components/sidebar/sidebar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetsService, IdSequenceService } from '../../../services';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

describe('Sidebar component', () => {
  let component: ShSidebarComponent;
  let fixture: ComponentFixture<ShSidebarComponent>;
  let htmlElement: HTMLDivElement;

  const mockedGet = jasmine.createSpy();

  const mockedAssetsService = new AssetsService(null);

  mockedAssetsService.get = mockedGet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ShSidebarComponent, ShIconComponent, ShSidebarItemComponent],
      providers: [
        IdSequenceService,
        { provide: AssetsService, useValue: mockedAssetsService },
        ChangeDetectorRef
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSidebarComponent);
    component = fixture.debugElement.componentInstance;
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

  describe('constructor', () => {
    it('should set assetsService', () => {
      expect(component['_assetsService']).toBeDefined();
      expect(component['_assetsService']).not.toBeNull();
      expect(component['_assetsService']).toBeInstanceOf(AssetsService);
    });
    it('should set changeDetection', () => {
      expect(component['changeDetection']).toBeDefined();
      expect(component['changeDetection']).not.toBeNull();
    });
  });

  describe('ngOnInit', () => {
    const fakeCommands: any[] = [{ name: 'command1' }, { name: 'command2' }];
    it('should set commands calling onGetData when defined', async(() => {
      fixture.whenStable().then(async () => {
        const mockedOnGetData = jasmine.createSpy().and.returnValue(fakeCommands);
        component.onGetData = mockedOnGetData;

        await component.ngOnInit();

        expect(mockedOnGetData).toHaveBeenCalledTimes(1);
        expect(component['commands']).toEqual(fakeCommands);
      });
    }));
    it('should set commands calling assetsService get', async(() => {
      fixture.whenStable().then(async () => {
        mockedGet.and.returnValue(fakeCommands);
        mockedGet.calls.reset();

        await component.ngOnInit();

        expect(mockedGet).toHaveBeenCalledTimes(1);
        expect(mockedGet).toHaveBeenCalledWith('sidebar.json');
        expect(component['commands']).toEqual(fakeCommands);
      });
    }));
    it('should call markForCheck when detectionStrategy is OnPush', async(() => {
      fixture.whenStable().then(async () => {
        const markForCheckSpy = spyOn(component['changeDetection'], 'markForCheck');
        Object.defineProperty(SH_CHANGE_DETECTOR, 'STRATEGY', {
          value: ChangeDetectionStrategy.OnPush
        });

        await component.ngOnInit();

        expect(markForCheckSpy).toHaveBeenCalledTimes(1);
      });
    }));
  });
  describe('toggle', () => {
    it('should set expandedCommandId to undefined when id matches', () => {
      const id = 'foo';
      component['expandedCommandId'] = id;

      component['toggle'](id);

      expect(component['expandedCommandId']).toBeUndefined();
    });
    it('should set expandedCommandId to given value when actual is not equal', () => {
      const id = 'foo';
      component['expandedCommandId'] = 'sample';

      component['toggle'](id);

      expect(component['expandedCommandId']).toEqual(id);
    });
  });

});
