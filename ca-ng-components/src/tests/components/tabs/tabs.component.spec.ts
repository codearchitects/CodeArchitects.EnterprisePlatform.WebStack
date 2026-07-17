import { TranslateModule } from '@ngx-translate/core';
import { ShBaseAuthComponent } from './../../../components/base/base-auth.component';
import { ShTabsComponent } from '../../../components/tabs/tabs.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';

describe('Tabs component', () => {
  let component: ShTabsComponent;
  let fixture: ComponentFixture<ShTabsComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ShTabsComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShTabsComponent);
    component = fixture.debugElement.componentInstance;
    component.model = [{ title: 'tab1' }, { title: 'tab2' }];
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should set defaults correctly', () => {
    expect(Array.isArray(component.model)).toBeTruthy();
    expect(component.autosetCurrentTab).toBeTruthy();
    expect(component.isLeftAligned).toBeFalsy();
    expect(component.hasAbsoluteContent).toBeFalse();
  });

  describe('ngOnInit', () => {
    it('should call super ngOnInit', () => {
      const superSpy = spyOn(ShBaseAuthComponent.prototype, 'ngOnInit');
      component.autosetCurrentTab = false;
      expect(superSpy).not.toHaveBeenCalled();

      component.ngOnInit();

      expect(superSpy).toHaveBeenCalledTimes(1);
    });
    it('should set current tab as first tab when autosetCurrentTab is true and isCurrent is not set for each tab in the model', () => {
      const selectSpy = spyOn(component as any, 'select');
      component.autosetCurrentTab = true;

      component.ngOnInit();

      expect(selectSpy).toHaveBeenCalledOnceWith(component.model[0]);
    });
    it('should set current tab as second tab when autosetCurrentTab is true and isCurrent is set on second tab of the model', () => {
      const selectSpy = spyOn(component as any, 'select');
      component.autosetCurrentTab = true;
      component.model[0].isCurrent = false;
      component.model[1].isCurrent = true;

      component.ngOnInit();

      expect(selectSpy).toHaveBeenCalledOnceWith(component.model[1]);
    });

    describe('select', () => {
      it('should do nothing when onCanValueChanges returns false', () => {
        const fakeTab = { title: 'myFakeTab' };
        const givenTab = { title: 'givenTab' };
        const onCanValueChangesSpy = spyOn(component['internalOptions'], 'onCanValueChanges').and.returnValue(false);
        component['current'] = fakeTab;

        component['select'](givenTab);

        expect(onCanValueChangesSpy).toHaveBeenCalledOnceWith(fakeTab, givenTab);
        expect(component['current']).toEqual(fakeTab);
      });
      it('should set all other tabs isCurrent to false and given one to true, emitting a tabChange event', () => {
        const givenTab = { title: 'givenTab' };
        const emitSpy = spyOn(component.tabChange, 'emit');
        component.model.push(givenTab);
        component.model[0].isCurrent = false;
        component.model[1].isCurrent = true;

        component['select'](givenTab);

        component.model.forEach(tab => expect(tab.isCurrent).toEqual(tab.title === givenTab.title));
        expect(component['current']).toEqual(givenTab);
        expect(component['templateContext'].$implicit).toEqual(givenTab);
        expect(emitSpy).toHaveBeenCalledOnceWith(givenTab);
      });
    });
  });

});
