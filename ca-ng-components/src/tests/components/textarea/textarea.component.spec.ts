import { ShTextareaComponent } from './../../../components/textarea/textarea.component';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShIconComponent } from '../../../components/icon/icon.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import * as $ from 'jquery';

describe('Textarea component', () => {
  let component: ShTextareaComponent;
  let fixture: ComponentFixture<ShTextareaComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShTextareaComponent, ShIconComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShTextareaComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
    component.prop = 'prop';
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
    const textarea = htmlElement.firstElementChild as HTMLTextAreaElement;
    expect(textarea).toBeDefined();
    expect(textarea).not.toBeNull();
    expect(textarea instanceof HTMLTextAreaElement).toBeTruthy();
  });
  it('getDefaultOptions should set autoresize correctly', () => {
    const options = component['getDefaultOptions']();
    expect(options).toBeDefined();
    expect(options).not.toBeNull();
    expect(options.autoresize).toBeFalsy();
  });
  it('constructor should set an onModelValueChanges callback that calls autoresize', () => {
    component['internalOptions'].autoresize = true;
    const autoresizeSpy = spyOn(component as any, 'autoresize');
    autoresizeSpy.calls.reset();

    component['onModelValueChanges'](null, null);
    expect(autoresizeSpy).toHaveBeenCalledTimes(1);
  });
  it('ngAfterViewInit should call setupAutoResizing when autoresize is true', done => {
    component['internalOptions'].autoresize = true;
    const setupAutoResizingSpy = spyOn(component as any, 'setupAutoResizing');
    setupAutoResizingSpy.calls.reset();

    component.ngAfterViewInit();
    setTimeout(() => {
      expect(setupAutoResizingSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it('ngOnChanges should call autoresize when model changes and autoresize is true', () => {
    const change = new SimpleChange(undefined, null, false);
    const autoresizeSpy = spyOn(component as any, 'autoresize');
    autoresizeSpy.calls.reset();
    component['internalOptions'].autoresize = true;

    component.ngOnChanges({ model: change });
    expect(autoresizeSpy).toHaveBeenCalledTimes(1);
  });
  describe('setupAutoResizing', () => {
    (window as any).$ = $;
    it('should set _element', () => {
      const textarea = $(`#${component['internalOptions'].id}`);

      component['setupAutoResizing']();
      expect(component['_element']).toEqual(textarea);
    });
    it('should call autoresize on keydown', () => {
      const autoresizeSpy = spyOn(component as any, 'autoresize');

      component['setupAutoResizing']();

      autoresizeSpy.calls.reset();
      const event = new KeyboardEvent('keydown');
      htmlElement.firstElementChild.dispatchEvent(event);
      expect(autoresizeSpy).toHaveBeenCalledTimes(1);
    });
    it('should call setMaxRows if defined', () => {
      const setMaxRowsSpy = spyOn(component as any, 'setMaxRows');
      setMaxRowsSpy.calls.reset();
      component['internalOptions'].maxRows = 8;

      component['setupAutoResizing']();
      expect(setMaxRowsSpy).toHaveBeenCalledTimes(1);
    });
    it('should call autoresize when getControlValue returns something defined', () => {
      const autoresizeSpy = spyOn(component as any, 'autoresize');
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue({});
      autoresizeSpy.calls.reset();
      getControlValueSpy.calls.reset();

      component['setupAutoResizing']();
      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
      expect(autoresizeSpy).toHaveBeenCalledTimes(1);
    });
  });
  it('setMaxRows should set max-height to maxRows * lineHeight', () => {
    const maxRows = 10;
    const lineHeight = 16;
    const textarea = htmlElement.firstElementChild as HTMLTextAreaElement;
    textarea.style.lineHeight = `${lineHeight}px`;
    component['internalOptions'].maxRows = maxRows;
    component['_element'] = $(`#${component['internalOptions'].id}`);

    component['setMaxRows']();
    expect(textarea.style.maxHeight).toEqual(`${maxRows * lineHeight}px`);
  });
  it('autoresize should set height to scrollHeight', done => {
    const scrollHeight = 164;
    const textarea = htmlElement.firstElementChild as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true
    });
    (textarea as any).scrollHeight = scrollHeight;
    component['_element'] = $(`#${component['internalOptions'].id}`);

    component['autoresize']();
    setTimeout(() => {
      expect(textarea.style.height).toEqual(`${scrollHeight}px`);
      done();
    });
  });
});
