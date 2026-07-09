import { Component, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, inject, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommandDispatcherService, ICommand, ShCommandComponent } from '@ca-webstack/ng-command-dispatcher';
import { ShTranslateModule } from '@ca-webstack/ng-components';
import { CaepIdSequenceService } from '../../../../services';
import { CaepContainerModule } from '../../container.module';
import { CAEP_TOPBAR_FAMILY, CaepTopbarItemPosition, ICaepTopbarItem } from '../../models';
import { CaepTopbarService } from '../../services';
import { CaepTopbarButtonComponent } from '../topbar-button/topbar-button.component';
import { CaepTopbarComponent } from './topbar.component';

describe('CaepTopbarComponent', () => {
  let componentInstance: CaepTopbarComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CaepContainerModule.forRoot({ taskSlotFactory: null, stackFrameFactory: null }),
        ShTranslateModule.forRoot()
      ],
      declarations: [BaseTopbarTestComponent, TemplateTopbarTestComponent, CaepTopbarButtonComponent],
      providers: [CaepIdSequenceService, CommandDispatcherService, provideZoneChangeDetection()]
    });
    TestBed.compileComponents();
  });
  describe('Base', () => {
    let fixture: ComponentFixture<BaseTopbarTestComponent>;
    beforeEach(async () => {
      fixture = TestBed.createComponent(BaseTopbarTestComponent);
      await fixture.whenStable();
      fixture.detectChanges();
      componentInstance = fixture.debugElement
        .query(By.directive(CaepTopbarComponent))!
        .injector.get<CaepTopbarComponent>(CaepTopbarComponent);
    });
    it('should render without any error', () => {
      expect(fixture).not.toBeNull();
      expect(fixture).toBeDefined();
      expect(componentInstance).not.toBeNull();
      expect(componentInstance).toBeDefined();
    });
    it('should call registerOrUpdate with command dispatcher commands', fakeAsync(
      inject(
        [CommandDispatcherService, CaepTopbarService],
        (commandDispatcher: CommandDispatcherService, topbar: CaepTopbarService) => {
          const spy = spyOn(topbar, 'registerOrUpdate').and.callThrough();
          const cmd = 'magna dolore eiusmod';
          const cmd1 = 'do sunt tempor';
          const commands = (): ICommand[] => {
            return [
              {
                name: cmd,
                family: CAEP_TOPBAR_FAMILY
              },
              {
                name: cmd1,
                family: CAEP_TOPBAR_FAMILY
              }
            ];
          };
          spy.calls.reset();
          // pre-assert
          expect(spy).toHaveBeenCalledTimes(0);
          expect(topbar.snapshot.length).toEqual(0);
          // act
          commandDispatcher.add({ shCommands: commands } as ShCommandComponent);
          tick(200);
          flush();
          // assert
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            jasmine.objectContaining({ id: cmd }),
            jasmine.objectContaining({ id: cmd1 })
          );
          expect(topbar.snapshot.length).toEqual(2);
        }
      )
    ));
    it('should call unregister only for unregistered component commands', fakeAsync(
      inject(
        [CommandDispatcherService, CaepTopbarService],
        (commandDispatcher: CommandDispatcherService, topbar: CaepTopbarService) => {
          const spy = spyOn(topbar, 'unregister').and.callThrough();
          const cmd = 'magna dolore eiusmod';
          const cmp = {
            shCommands: () => [
              {
                name: cmd,
                family: CAEP_TOPBAR_FAMILY
              }
            ]
          } as ShCommandComponent;
          const cmd1 = 'do sunt tempor';
          const cmp1 = {
            shCommands: () => [
              {
                name: cmd1,
                family: CAEP_TOPBAR_FAMILY
              }
            ]
          } as ShCommandComponent;
          // arrange
          commandDispatcher.add(cmp);
          commandDispatcher.add(cmp1);
          flush();
          spy.calls.reset();
          // pre-assert
          expect(spy).toHaveBeenCalledTimes(0);
          // act
          commandDispatcher.remove(cmp);
          tick(200);
          flush();
          // assert
          expect(spy).toHaveBeenCalledOnceWith(cmd);
          expect(topbar.snapshot.length).toEqual(1);
          expect(topbar.snapshot[0].id).toEqual(cmd1);
        }
      )
    ));
  });

  describe('Templates', () => {
    let fixture: ComponentFixture<TemplateTopbarTestComponent>;
    beforeEach(async () => {
      fixture = TestBed.createComponent(TemplateTopbarTestComponent);
      await fixture.whenStable();
      fixture.detectChanges();
      componentInstance = fixture.debugElement
        .query(By.directive(CaepTopbarComponent))!
        .injector.get<CaepTopbarComponent>(CaepTopbarComponent);
    });
    it('should register given template', fakeAsync(
      inject([CaepTopbarService], (topbar: CaepTopbarService) => {
        // arrange
        const spy = spyOn(topbar, 'registerOrUpdate').and.callThrough();
        spy.calls.reset();
        // pre-assert
        expect(topbar.snapshot.length).toEqual(0);
        expect(spy).toHaveBeenCalledTimes(0);
        // act
        fixture.componentInstance.toggler = true;
        fixture.detectChanges();
        tick(200);
        flush();
        // assert
        expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ id: 'veniam-qui-nulla-ad' }));
        expect(topbar.snapshot.length).toEqual(1);
        expect(topbar.snapshot[0].id).toEqual('veniam-qui-nulla-ad');
      })
    ));
    it('should unregister given template', fakeAsync(
      inject([CaepTopbarService], (topbar: CaepTopbarService) => {
        // arrange
        const spy = spyOn(topbar, 'unregister').and.callThrough();
        expect(topbar.snapshot.length).toEqual(0);
        fixture.componentInstance.toggler = true;
        fixture.detectChanges();
        tick(200);
        flush();
        expect(topbar.snapshot.length).toEqual(1);
        expect(topbar.snapshot[0].id).toEqual('veniam-qui-nulla-ad');
        // pre-assert
        spy.calls.reset();
        expect(spy).toHaveBeenCalledTimes(0);
        // act
        fixture.componentInstance.toggler = false;
        fixture.detectChanges();
        tick(200);
        flush();
        // assert
        expect(spy).toHaveBeenCalledWith('veniam-qui-nulla-ad');
        expect(topbar.snapshot.length).toEqual(0);
      })
    ));
  });
  describe('Positioning and ordering', () => {
    let fixture: ComponentFixture<BaseTopbarTestComponent>;
    beforeEach(async () => {
      fixture = TestBed.createComponent(BaseTopbarTestComponent);
      await fixture.whenStable();
      fixture.detectChanges();
      componentInstance = fixture.debugElement
        .query(By.directive(CaepTopbarComponent))!
        .injector.get<CaepTopbarComponent>(CaepTopbarComponent);
    });
    it('should render items according to their position', fakeAsync(
      inject([CaepTopbarService], async (topbar: CaepTopbarService) => {
        // arrange
        const rightByDefault: ICaepTopbarItem = {
          id: 'rightByDefault'
        };
        const right: ICaepTopbarItem = {
          id: 'right',
          position: CaepTopbarItemPosition.Right
        };
        const left: ICaepTopbarItem = {
          id: 'left',
          position: CaepTopbarItemPosition.Left
        };
        const center: ICaepTopbarItem = {
          id: 'center',
          position: CaepTopbarItemPosition.Center
        };
        topbar.register(rightByDefault, right, left, center);
        fixture.detectChanges();
        tick(1000);
        flush();
        // assert
        expect(topbar.snapshot.length).toEqual(4);
        const leftElements = fixture.debugElement.queryAll(By.css('div.left .topbar-item-container'));
        expect(leftElements.length).toEqual(1);
        expect(leftElements[0].componentInstance.model.id).toEqual('left');
        const centerElements = fixture.debugElement.queryAll(By.css('div.center .topbar-item-container'));
        expect(centerElements.length).toEqual(1);
        expect(centerElements[0].componentInstance.model.id).toEqual('center');
        const rightElements = fixture.debugElement.queryAll(By.css('div.right .topbar-item-container'));
        expect(rightElements.length).toEqual(2);
        expect(rightElements.some(element => element.componentInstance.model.id === 'right')).toBeTrue();
        expect(rightElements.some(element => element.componentInstance.model.id === 'rightByDefault')).toBeTrue();
      })
    ));
    it('should render items according to their order', fakeAsync(
      inject([CaepTopbarService], (topbar: CaepTopbarService) => {
        const shuffle = <T>(array: T[]): T[] => {
          const newArray = [...array];
          newArray.forEach((_, index) => {
            const randomIndex = Math.floor(Math.random() * newArray.length);
            [newArray[index], newArray[randomIndex]] = [newArray[randomIndex], newArray[index]];
          });
          return newArray;
        };
        // arrange
        const items: ICaepTopbarItem[] = shuffle([
          {
            id: 'rightUnordered',
            position: CaepTopbarItemPosition.Right
          },
          {
            id: 'right2',
            position: CaepTopbarItemPosition.Right,
            order: 2
          },
          {
            id: 'right0',
            position: CaepTopbarItemPosition.Right,
            order: 0
          },
          {
            id: 'right1',
            position: CaepTopbarItemPosition.Right,
            order: 1
          },
          {
            id: 'center0',
            position: CaepTopbarItemPosition.Center,
            order: 0
          },
          {
            id: 'center1',
            position: CaepTopbarItemPosition.Center,
            order: 1
          },
          {
            id: 'center2',
            position: CaepTopbarItemPosition.Center,
            order: 2
          },
          {
            id: 'left0',
            position: CaepTopbarItemPosition.Left,
            order: 0
          },
          {
            id: 'left1',
            position: CaepTopbarItemPosition.Left,
            order: 1
          },
          {
            id: 'leftUnordered',
            position: CaepTopbarItemPosition.Left
          }
        ]);

        topbar.register(...items);
        fixture.detectChanges();
        tick(1000);
        flush();
        // assert
        expect(topbar.snapshot.length).toEqual(10);
        const leftElements = fixture.debugElement.queryAll(By.css('div.left .topbar-item-container'));
        const centerElements = fixture.debugElement.queryAll(By.css('div.center .topbar-item-container'));
        const rightElements = fixture.debugElement.queryAll(By.css('div.right .topbar-item-container'));
        expect(leftElements.length).toEqual(3);
        expect(centerElements.length).toEqual(3);
        expect(rightElements.length).toEqual(4);
        expect(leftElements.map(itm => itm.componentInstance.model.id)).toEqual(['left0', 'left1', 'leftUnordered']); // LTR
        expect(centerElements.map(itm => itm.componentInstance.model.id)).toEqual(['center0', 'center1', 'center2']); // LTR
        expect(rightElements.map(itm => itm.componentInstance.model.id)).toEqual([
          'rightUnordered',
          'right2',
          'right1',
          'right0'
        ]); // RTL
      })
    ));
  });
});

@Component({
    template: `<div style="width: 100vw; height: 100px"><caep-topbar></caep-topbar></div>`,
    standalone: false
})
class BaseTopbarTestComponent {}
@Component({
    template: `<caep-topbar>
      @if (toggler) {
        <ng-template caepTopbarItem id="veniam-qui-nulla-ad">sed ipsum sit cupidatat deserunt</ng-template>
      }
    </caep-topbar>`,
    standalone: false
})
class TemplateTopbarTestComponent {
  public toggler = false;
}
