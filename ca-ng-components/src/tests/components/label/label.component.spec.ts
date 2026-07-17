import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule } from '@ngx-translate/core';
import { IShLabelOptions, ShLabelComponent } from './../../../components/label/label.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { IdSequenceService } from '../../../services/id-sequence.service';

describe('Label component', () => {
  let component: ShLabelComponent<any, IShLabelOptions>;
  let fixture: ComponentFixture<ShLabelComponent<any, IShLabelOptions>>;
  let htmlElement: HTMLLabelElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), I18nModule],
      declarations: [ShLabelComponent],
      providers: [IdSequenceService, ContextService, AspectHelper]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShLabelComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('label');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement).toBeInstanceOf(HTMLLabelElement);
  });

  describe('constructor', () => {
    it('should set aspectHelper', () => {
      expect(component['aspectHelper']).toBeDefined();
      expect(component['aspectHelper']).not.toBeNull();
      expect(component['aspectHelper']).toBeInstanceOf(AspectHelper);
    });
    it('should set contextService', () => {
      expect(component['_contextService']).toBeDefined();
      expect(component['_contextService']).not.toBeNull();
      expect(component['_contextService']).toBeInstanceOf(ContextService);
    });
  });

  describe('ngOnChanges', () => {
    it('should set label given from aspectHelper', () => {
      const changes: SimpleChanges = {
        'myChange': {} as any
      };
      const expectedLabel = 'myLabel';
      const getLabelSpy = spyOn(component['aspectHelper'], 'getLabel').and.returnValue(expectedLabel);
      const mockedModel = { myModel: 'foo' };
      const mockedProp = 'myModel';
      const mockedContext: any = { foo: 'sample' };
      component.model = mockedModel;
      component.prop = mockedProp;
      Object.defineProperty(component['_contextService'], 'context', {
        value: mockedContext
      });
      component['internalOptions'] = null;

      component.ngOnChanges(changes);

      expect(getLabelSpy).toHaveBeenCalledTimes(1);
      expect(getLabelSpy).toHaveBeenCalledWith(mockedModel, mockedProp, mockedContext);
      expect(component['label']).toEqual(expectedLabel);
    });
    it('should set internalOptions label if no label is returned by aspectHelper', () => {
      const changes: SimpleChanges = {
        'myChange': {} as any
      };
      spyOn(component['aspectHelper'], 'getLabel').and.returnValue(null);
      const expectedLabel = 'sample';
      component['internalOptions'].label = expectedLabel;

      component.ngOnChanges(changes);

      expect(component['label']).toEqual(expectedLabel);
    });
  });
  it('getDefaultOptions should retrieve options correctly', () => {
    const options = component['getDefaultOptions']();

    expect(options.labelClass).toBeDefined;
    expect(options.labelClass).not.toBeNull;
    expect(options.labelClass).toEqual([]);
  });
});
