import { TranslateModule } from '@ngx-translate/core';
import { ShSectionComponent } from '../../../components/section/section.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('Section component', () => {
  let component: ShSectionComponent;
  let fixture: ComponentFixture<ShSectionComponent>;
  let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ShSectionComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSectionComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement.querySelector('.section-header')).not.toBeNull();
    expect(htmlElement.querySelector('.section-body')).not.toBeNull();
  });

  it('should initialize value correctly', () => {
    expect(component.isInline).toBeTruthy();
    expect(component.isCollapsible).toBeTruthy();
    expect(component.collapsed).toBeFalsy();
    expect(component['_enabled']).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set element ref', () => {
      expect(component['_elementRef']).toBeDefined();
      expect(component['_elementRef']).not.toBeNull();
    });
    it('should set enabled correctly', () => {
      const expectedState = false;
      component.enable = expectedState;

      expect(component['_enabled']).toBeFalsy();
    });
    it('should set tabIndex for each control in the section when setting enable to true', () => {
      const el1 = document.createElement('input');
      const el2 = document.createElement('input');
      const el3 = document.createElement('input');
      const el1DefaultTabIndex = 1;
      const el2DefaultTabIndex = 2;
      const el3DefaultTabIndex = 3;
      const sectionBody = htmlElement.querySelector('.section-body');
      el1.tabIndex = 0;
      el2.tabIndex = 0;
      el3.tabIndex = 0;
      el1['defaultTabIndex'] = el1DefaultTabIndex;
      el2['defaultTabIndex'] = el2DefaultTabIndex;
      el3['defaultTabIndex'] = el3DefaultTabIndex;
      sectionBody.appendChild(el1);
      sectionBody.appendChild(el2);
      sectionBody.appendChild(el3);

      component.enable = true;

      expect(el1.tabIndex).toEqual(el1DefaultTabIndex);
      expect(el2.tabIndex).toEqual(el2DefaultTabIndex);
      expect(el3.tabIndex).toEqual(el3DefaultTabIndex);
    });
    it('should set tabIndex to -1 and store current tabIndex to defaultTabIndex when enable is set to false', () => {
      const el1 = document.createElement('input');
      const el2 = document.createElement('input');
      const el3 = document.createElement('input');
      const el1TabIndex = 1;
      const el2TabIndex = 2;
      const el3TabIndex = 3;
      const sectionBody = htmlElement.querySelector('.section-body');
      el1.tabIndex = el1TabIndex;
      el2.tabIndex = el2TabIndex;
      el3.tabIndex = el3TabIndex;
      sectionBody.appendChild(el1);
      sectionBody.appendChild(el2);
      sectionBody.appendChild(el3);

      component.enable = false;

      expect(el1.tabIndex).toEqual(-1);
      expect(el2.tabIndex).toEqual(-1);
      expect(el3.tabIndex).toEqual(-1);
      expect(el1['defaultTabIndex']).toEqual(el1TabIndex);
      expect(el2['defaultTabIndex']).toEqual(el2TabIndex);
      expect(el3['defaultTabIndex']).toEqual(el3TabIndex);
    });
    it('should not throw error if section has no controls', () => {
      const el1 = document.createElement('input');
      const sectionBody = htmlElement.querySelector('.section-body');
      el1['defaultTabIndex'] = 1;
      sectionBody.appendChild(el1);

      component.enable = true;

      expect(el1.tabIndex).toEqual(0);
    });
    it('should not throw error if section body is not rendered', () => {
      const sectionBody = htmlElement.querySelector('.section-body');
      htmlElement.removeChild(sectionBody);

      expect(() => component.enable = true).not.toThrowError();
    });
  });

  describe('ngOnChanges', () => {
    it('should do nothing when change does not target isInline', () => {
      const element = component['_elementRef'].nativeElement;
      const jQuerySpy = spyOn((window as any), '$').and.callThrough();
      const changes: SimpleChanges = {
        'someChange': new SimpleChange(undefined, null, false)
      };

      component.ngOnChanges(changes);

      expect(element).toEqual(element);
      expect(jQuerySpy).not.toHaveBeenCalled();
    });
    it('should set attribute inline to element when isInline is true', () => {
      const element: HTMLElement = component['_elementRef'].nativeElement;
      const jQuerySpy = spyOn((window as any), '$').and.callThrough();
      const changes: SimpleChanges = {
        'isInline': new SimpleChange(false, true, false)
      };
      element.removeAttribute('inline');
      component.isInline = true;

      component.ngOnChanges(changes);

      expect(jQuerySpy).toHaveBeenCalledOnceWith(element);
      expect(element.hasAttribute('inline')).toBeTruthy('');
    });
    it('should remove attribute inline to element when isInline is true', () => {
      const element: HTMLElement = component['_elementRef'].nativeElement;
      const jQuerySpy = spyOn((window as any), '$').and.callThrough();
      const changes: SimpleChanges = {
        'isInline': new SimpleChange(true, false, false)
      };
      element.setAttribute('inline', '');
      component.isInline = false;

      component.ngOnChanges(changes);

      expect(jQuerySpy).toHaveBeenCalledOnceWith(element);
      expect(element.hasAttribute('inline')).toBeFalsy();
    });
  });

  describe('toggle', () => {
    it('should not toggle collapse and emit change when title is not defined', () => {
      const changeEmitSpy = spyOn(component.collapsedChange, 'emit');
      const collapsedState = true;
      component.title = null;
      component.isCollapsible = true;
      component.collapsed = collapsedState;

      component['toggle']();

      expect(changeEmitSpy).not.toHaveBeenCalled();
      expect(component.collapsed).toEqual(collapsedState);
    });
    it('should not toggle collapse and emit change when is not collapsible', () => {
      const changeEmitSpy = spyOn(component.collapsedChange, 'emit');
      const collapsedState = true;
      component.title = 'myTitle';
      component.isCollapsible = false;
      component.collapsed = collapsedState;

      component['toggle']();

      expect(changeEmitSpy).not.toHaveBeenCalled();
      expect(component.collapsed).toEqual(collapsedState);
    });
    it('should toggle collapse and emit change', () => {
      const changeEmitSpy = spyOn(component.collapsedChange, 'emit');
      const collapsedState = true;
      component.title = 'myTitle';
      component.isCollapsible = true;
      component.collapsed = collapsedState;

      component['toggle']();

      expect(changeEmitSpy).toHaveBeenCalledOnceWith(!collapsedState);
      expect(component.collapsed).toEqual(!collapsedState);
    });
  });

});
