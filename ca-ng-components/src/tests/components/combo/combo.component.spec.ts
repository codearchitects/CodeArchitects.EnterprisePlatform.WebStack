import { ILookupSingle } from './../../../components/base/base-lookup-single.component';
import { ShSelectComponent } from './../../../components/select/select.component';
import { IShComboOptions } from './../../../components/combo/combo.component';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShComboComponent } from '../../../components/combo/combo.component';
import { ShIconComponent } from '../../../components/icon/icon.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as keyCodeConst from '../../../utilities/key-code.const';
import { BehaviorSubject, defer, pipe } from 'rxjs';

describe('Combo component', () => {
  let component: ShComboComponent<any, IShComboOptions<any>>;
  let fixture: ComponentFixture<ShComboComponent<any, IShComboOptions<any>>>;
  let htmlElement: HTMLDivElement;
  const model = { prop: 'value' };
  const prop = 'prop';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShComboComponent, ShIconComponent],
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
    fixture = TestBed.createComponent(ShComboComponent);
    component = fixture.debugElement.componentInstance;
    component.model = model;
    component.prop = prop;
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
    const input = htmlElement.children[0] as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();
    expect(input instanceof HTMLInputElement).toBeTruthy();
    expect(input.type).toEqual('text');
  });
  describe('constructor', () => {
    it('should set translate service', () => {
      expect(component['_translateService']).toBeDefined();
      expect(component['_translateService']).not.toBeNull();
      expect(component['_translateService'] instanceof TranslateService).toBeTruthy();
    });
    it('should set keyDownDebounceTime', () => {
      expect(component['keyDownDebounceTime']).toEqual(10);
    });
    it('should set onModelValueChanges', () => {
      expect(component['onModelValueChanges']).toBeDefined();
      expect(component['onModelValueChanges']).not.toBeNull;
      expect(typeof component['onModelValueChanges']).toEqual('function');
    });
    describe('onModelValueChanges', () => {
      it('should set text correctly when value is defined', async(() => {
        const text = 'hello world';
        const translatedText = 'ciao mondo';
        const translateSpy = spyOn(component as any, 'translate').and.returnValue(translatedText);
        spyOn(component as any, 'onModelValueChanges').and.callThrough();

        fixture.whenStable().then(async () => {
          await component['onModelValueChanges']('value', text);

          expect(translateSpy).toHaveBeenCalledTimes(1);
          expect(translateSpy).toHaveBeenCalledWith(text);
          expect(component['text']).toEqual(translatedText);
        });
      }));
      it('should set text to undefined and call onDelete when value is undefined', async(() => {
        component['text'] = 'foo';
        const deleteSpy = spyOn(component as any, 'onDelete');

        fixture.whenStable().then(async () => {
          await component['onModelValueChanges'](undefined, undefined);

          expect(component['text']).toBeUndefined();
          expect(deleteSpy).toHaveBeenCalledTimes(1);
        });
      }));
    });
  });
  describe('ngOnInit', () => {
    it('should set activeResultIndex to -1 when showTextAsResult is true', async () => {
      component.options = {
        showTextAsResult: true
      };
      await component.ngOnInit();

      expect(component['activeResultIndex']).toEqual(-1);
    });
    it('should set onDropdownToggled function when showTextAsResult is true', async () => {
      component.options = {
        showTextAsResult: true
      };

      await component.ngOnInit();
      expect(component['onDropdownToggled']).toBeDefined();
      expect(component['onDropdownToggled']).not.toBeNull();
      expect(typeof component['onDropdownToggled']).toEqual('function');

      component['onDropdownToggled']();
      expect(component['activeResultIndex']).toEqual(-1);
    });
    it('should set text to model value when showTextAsResult is true', async () => {
      const expectedValue = 'mockedModelValue';
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(expectedValue);
      component.options = {
        showTextAsResult: true
      };

      await component.ngOnInit();

      expect(getModelValueSpy).toHaveBeenCalled();
      expect(component['text']).toEqual(expectedValue);
    });
    it('should call onSelectText when showTextAsResult is true', async () => {
      const onSelectTextSpy = spyOn(component as any, 'onSelectText');
      component.options = {
        showTextAsResult: true
      };


      await component.ngOnInit();

      expect(onSelectTextSpy).toHaveBeenCalledTimes(1);
      expect(onSelectTextSpy).toHaveBeenCalledWith(model[prop]);
    });
    it('should call onModelValueChanges', async () => {
      const expectedModelValue = 'foo';
      const expectedControlValue = 'sample';
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(expectedModelValue);
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(expectedControlValue);
      const onModelValueChangesSpy = spyOn(component as any, 'onModelValueChanges');

      await component.ngOnInit();

      expect(getModelValueSpy).toHaveBeenCalledTimes(1);
      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
      expect(onModelValueChangesSpy).toHaveBeenCalledTimes(1);
      expect(onModelValueChangesSpy).toHaveBeenCalledWith(expectedControlValue, expectedModelValue);
    });
    it('should not call onSelectText when index is not found in values', async(() => {
      fixture.whenStable().then(async () => {
        const values: ILookupSingle<string>[] = [{
          id: '0',
          label: 'a',
          ref: 'a'
        }];
        component.options = {
          showTextAsResult: true,
          values: values
        };
        spyOn(component as any, 'getModelValue').and.returnValue('a');
        spyOn(ShSelectComponent.prototype, 'ngOnInit');
        component['internalOptions'].showTextAsResult = true;
        component['values'] = values;
        const findIndexSpy = spyOn(values, 'findIndex').and.callThrough();
        const selectTextSpy = spyOn(component as any, 'onSelectText');

        await component.ngOnInit();

        expect(findIndexSpy).toHaveBeenCalledTimes(1);
        expect(selectTextSpy).not.toHaveBeenCalled();
      });
    }));
    describe('getData subscription', () => {
      it('should call getData when new text is suitable', async(() => {
        jasmine.clock().uninstall(); // to make sure there is no pending clock
        const getDataSpy = spyOn(component as any, 'getData');
        component['text'] = 'newText';

        expect(getDataSpy).toHaveBeenCalledTimes(0);
        fixture.whenStable().then(() => {
          jasmine.clock().install();

          component['_getData$'].next();

          jasmine.clock().tick(component['keyDownDebounceTime'] + 500);
          expect(getDataSpy).toHaveBeenCalledTimes(1);
          jasmine.clock().uninstall();
        });
      }));
      it('should call getData when text is undefined', async(() => {
        jasmine.clock().uninstall(); // to make sure there is no pending clock
        const getDataSpy = spyOn(component as any, 'getData');

        expect(getDataSpy).toHaveBeenCalledTimes(0);
        fixture.whenStable().then(() => {
          jasmine.clock().install();
          component['text'] = undefined;

          component['_getData$'].next();

          jasmine.clock().tick(component['internalOptions'].debounceTime);
          expect(getDataSpy).toHaveBeenCalledTimes(1);
          jasmine.clock().uninstall();
        });
      }));
    });
  });
  describe('onKey', () => {
    it('should call onSelectText when showTextAsResult is true, keypressed is enter and activreResultIndex is -1', async(() => {
      const expectedText = 'hello';
      const spy = spyOn(component as any, 'onSelectText');
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 13
      });
      fixture.whenStable().then(() => {
        component['text'] = expectedText;
        component['activeResultIndex'] = -1;
        component['internalOptions'].showTextAsResult = true;

        component['onKey'](event);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expectedText);
      });
    }));
    it('should next getData when key is a letter', () => {
      const nextMocked = jasmine.createSpy();
      const expectedKeyCode = 65;
      const isLetterMocked = jasmine.createSpy().and.returnValue(true);
      const event = new KeyboardEvent('keydown');
      spyOn(keyCodeConst, 'keyIsLetter').and.callFake(isLetterMocked);
      spyOn(component['_getData$'], 'next').and.callFake(nextMocked);
      Object.defineProperty(event, 'keyCode', {
        value: expectedKeyCode
      });

      component['onKey'](event);

      expect(isLetterMocked).toHaveBeenCalledTimes(1);
      expect(isLetterMocked).toHaveBeenCalledWith(expectedKeyCode);
      expect(nextMocked).toHaveBeenCalledTimes(1);
    });
    it('should next getData when key is a number', () => {
      const nextMocked = jasmine.createSpy();
      const expectedKeyCode = 100;
      const isNumberMocked = jasmine.createSpy().and.returnValue(true);
      const event = new KeyboardEvent('keydown');
      spyOn(keyCodeConst, 'keyIsNumber').and.callFake(isNumberMocked);
      spyOn(component['_getData$'], 'next').and.callFake(nextMocked);
      Object.defineProperty(event, 'keyCode', {
        value: expectedKeyCode
      });

      component['onKey'](event);

      expect(isNumberMocked).toHaveBeenCalledTimes(1);
      expect(isNumberMocked).toHaveBeenCalledWith(expectedKeyCode);
      expect(nextMocked).toHaveBeenCalledTimes(1);
    });
    it('should refresh data and skip super onKey when keyCode is backspace', () => {
      const nextMocked = jasmine.createSpy();
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'onKey');
      spyOn(component['_getData$'], 'next').and.callFake(nextMocked);
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 8
      });

      component['onKey'](event);
      expect(nextMocked).toHaveBeenCalledTimes(1);
      expect(superSpy).not.toHaveBeenCalled();
    });
  });
  it('onDelete should next getData and call super', () => {
    const nextMocked = jasmine.createSpy();
    const superSpy = spyOn(ShSelectComponent.prototype as any, 'onDelete');
    spyOn(component['_getData$'], 'next').and.callFake(nextMocked);

    component['onDelete']();
    expect(nextMocked).toHaveBeenCalledTimes(1);
    expect(superSpy).toHaveBeenCalledTimes(1);
  });
  it('onSelectValue should call setControlValue, set text and opened to false', async () => {
    const text = 'hello world';
    const translatedText = 'ciao mondo';
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    const translateSpy = spyOn(component as any, 'translate').and.returnValue(Promise.resolve(translatedText));

    component['text'] = 'foo';
    component['isOpened'] = true;

    await component['onSelectValue'](text);

    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(text);
    expect(translateSpy).toHaveBeenCalledTimes(1);
    expect(component['text']).toEqual(translatedText);
    expect(component['isOpened']).toBeFalsy();
  });
  it('onSelectText should call setControlValue with custom internalOptions callback return value and set opened to false', () => {
    const sourceText = 'my text';
    const pipedText = 'MyText';
    const callback = jasmine.createSpy().and.returnValue(pipedText);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    component['internalOptions'].onSelectText = callback;
    component['isOpened'] = false;

    component['onSelectText'](sourceText);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(sourceText);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(pipedText);
    expect(component['isOpened']).toBeFalsy();
  });
  describe('toggleResult', () => {
    const values: ILookupSingle<string>[] = [
      {
        id: '0',
        label: 'a',
        ref: 'a'
      },
      {
        id: '1',
        label: 'b',
        ref: 'b'
      },
      {
        id: '2',
        label: 'c',
        ref: 'c'
      }
    ];
    it('should set activeResultIndex to 0 when index is -1 and next is true', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      component['internalOptions'].showTextAsResult = true;

      component['toggleResult'](-1);

      expect(component['activeResultIndex']).toEqual(0);
      expect(superSpy).not.toHaveBeenCalled();
    });
    it('should set activeResultIndex to values length-1 when index is -1 and next is false', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      component['internalOptions'].showTextAsResult = true;
      component['values'] = values;

      component['toggleResult'](-1, false);

      expect(component['activeResultIndex']).toEqual(values.length - 1);
      expect(superSpy).not.toHaveBeenCalled();
    });
    it('should set activeResultIndex to -1 when index is equal to values length-1 and next is true', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      component['internalOptions'].showTextAsResult = true;
      component['values'] = values;

      component['toggleResult'](values.length - 1);

      expect(component['activeResultIndex']).toEqual(-1);
      expect(superSpy).not.toHaveBeenCalled();
    });
    it('should set activeResultIndex to values length-2 when index is equal to values length-1 and next is false', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      component['internalOptions'].showTextAsResult = true;
      component['values'] = values;

      component['toggleResult'](values.length - 1, false);

      expect(component['activeResultIndex']).toEqual(values.length - 2);
      expect(superSpy).not.toHaveBeenCalled();
    });
    it('should set activeResultIndex to -1 when index is equal to 0 and next is false', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      component['internalOptions'].showTextAsResult = true;

      component['toggleResult'](0, false);

      expect(component['activeResultIndex']).toEqual(-1);
      expect(superSpy).not.toHaveBeenCalled();
    });
    it('should call super toggleResult when index is any other value', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      const expectedIndex = 1;
      component['internalOptions'].showTextAsResult = true;

      component['toggleResult'](expectedIndex);

      expect(superSpy).toHaveBeenCalledTimes(1);
      expect(superSpy).toHaveBeenCalledWith(expectedIndex, true, false);
    });
    it('should call super toggleResult when apply is true', () => {
      const superSpy = spyOn(ShSelectComponent.prototype as any, 'toggleResult');
      const expectedIndex = 1;
      const expectedNext = false;
      const expectedApply = true;
      component['internalOptions'].showTextAsResult = true;

      component['toggleResult'](expectedIndex, expectedNext, expectedApply);

      expect(superSpy).toHaveBeenCalledTimes(1);
      expect(superSpy).toHaveBeenCalledWith(expectedIndex, expectedNext, expectedApply);
    });
  });
  it('onClickOutside should call onSelectText when showTextAsResult is true and text is suitable', () => {
    const expectedText = 'bar';
    const onSelectTextSpy = spyOn(component as any, 'onSelectText');
    component['values'] = [];
    component['text'] = expectedText;
    component['internalOptions'].showTextAsResult = true;
    component['isOpened'] = true;

    component['onClickOutside']();

    expect(component['isOpened']).toBeFalsy();
    expect(onSelectTextSpy).toHaveBeenCalledTimes(1);
    expect(onSelectTextSpy).toHaveBeenCalledWith(expectedText);
  });
  it('touch should call formControl markAsTouched', () => {
    const mockedMarkAsTouched = jasmine.createSpy();
    component['formControl'].markAsTouched = mockedMarkAsTouched;

    expect(component['formControl'].touched).toBeFalsy();

    component['touch']();

    expect(mockedMarkAsTouched).toHaveBeenCalledTimes(1);
  });
  it('should get default options correctly', () => {
    const expectedText = 'myText';
    const options = component['getDefaultOptions']();

    expect(options.minChars).toEqual(3);
    expect(options.debounceTime).toEqual(500);
    expect((options as any).source).toEqual([]);
    expect(options.onSelectText).toBeDefined();
    expect(options.onSelectText).not.toBeNull();
    expect(typeof options.onSelectText).toEqual('function');
    expect(options.onSelectText(expectedText)).toEqual(expectedText);
  });
  describe('getData', () => {
    it('should call setValues with empty array when no value is returned and set opened to false', async () => {
      const callback = jasmine.createSpy().and.returnValue(Promise.resolve(null));
      const setValuesSpy = spyOn(component, 'setValues');
      const expectedText = 'sample';
      component['text'] = expectedText;
      component['internalOptions'].onGetData = callback;

      await component['getData']();

      expect(callback).toHaveBeenCalledWith(expectedText);
      expect(setValuesSpy).toHaveBeenCalledTimes(1);
      expect(setValuesSpy).toHaveBeenCalledWith([]);
      expect(component['isOpened']).toBeFalsy();
    });
    it('should set isOpened to true when data is empty and showTextAsResult is true', async () => {
      const callback = jasmine.createSpy().and.returnValue(Promise.resolve(null));
      component['internalOptions'].onGetData = callback;
      component['internalOptions'].showTextAsResult = true;

      await component['getData']();

      expect(component['isOpened']).toBeTruthy();
    });
    it('should call onDropdownToggled when defined', async () => {
      const getDataCallback = jasmine.createSpy().and.returnValue(Promise.resolve(null));
      const dropdownCallback = jasmine.createSpy();
      component['internalOptions'].onGetData = getDataCallback;
      component['onDropdownToggled'] = dropdownCallback;

      await component['getData']();

      expect(dropdownCallback).toHaveBeenCalledTimes(1);
    });
    it('should call setControlValue with undefined when translated value is different from text value', async () => {
      const text = 'hello world';
      const translatedText = 'ciao mondo';
      const translateSpy = spyOn(component as any, 'translate').and.returnValue(translatedText);
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(text);
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const callback = jasmine.createSpy().and.returnValue(Promise.resolve(null));
      component['internalOptions'].onGetData = callback;
      component['text'] = text;

      await component['getData']();

      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
      expect(translateSpy).toHaveBeenCalledTimes(1);
      expect(translateSpy).toHaveBeenCalledWith(text);
      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(undefined);
    });
    it('should call filterAsync with internal options value', async () => {
      const values: string[] = ['a', 'b'];
      const mockedResponse = ['b'];
      const filterSpy = spyOn(component as any, 'filterAsync').and.returnValue(Promise.resolve(mockedResponse));
      const setValuesSpy = spyOn(component, 'setValues');
      component['internalOptions'].values = values;

      await component['getData']();

      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith(values);
      expect(setValuesSpy).toHaveBeenCalledTimes(1);
      expect(setValuesSpy).toHaveBeenCalledWith(mockedResponse);
    });
    it('should call filterAsync with mapped values when values is an observable', async () => {
      const values: ILookupSingle<string>[] = [
        {
          id: '0',
          label: 'a',
          ref: 'a'
        },
        {
          id: '1',
          label: 'b',
          ref: 'b'
        }
      ];
      const values$ = new BehaviorSubject(values);
      const expectedValues = values.map(value => value.ref);
      const mockedResponse = ['a'];
      const filterSpy = spyOn(component as any, 'filterAsync').and.returnValue(Promise.resolve(mockedResponse));
      const setValuesSpy = spyOn(component, 'setValues');
      component['internalOptions'].values = values$;
      component['values'] = values;

      await component['getData']();

      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith(expectedValues);
      expect(setValuesSpy).toHaveBeenCalledTimes(1);
      expect(setValuesSpy).toHaveBeenCalledWith(mockedResponse);
    });
  });
  it('filterAsync should return values correctly', async(() => {
    fixture.whenStable().then(async () => {
      component['text'] = 'ciao';
      const values: string[] = ['ciao', 'ciao mondo', 'addio mondo'];
      const translateSpy = spyOn(component as any, 'translate').and.callFake((value) => value);

      const result = await component['filterAsync'](values);

      expect(translateSpy).toHaveBeenCalledTimes(3);
      expect(translateSpy).toHaveBeenCalledWith(values[0]);
      expect(translateSpy).toHaveBeenCalledWith(values[1]);
      expect(translateSpy).toHaveBeenCalledWith(values[2]);
      expect(result).toEqual([values[0], values[1]]);
    });
  }));
  describe('translate', () => {
    it('should return control value calling pipe transform', async () => {
      const sourceValue = 'sample';
      const expectedValue = 'foo';
      const transform = jasmine.createSpy().and.returnValue(expectedValue);
      component['internalOptions'].valuesPipe = { transform };

      const result = await component['translate'](sourceValue);

      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(sourceValue);
      expect(result).toEqual(expectedValue);
    });
    it('should return control value calling pipe transform with args', async () => {
      const sourceValue = 'sample';
      const expectedValue = 'foo';
      const pipeArgs = ['myArgValue1', 'myArgValue2'];
      const transform = jasmine.createSpy().and.returnValue(expectedValue);
      component['internalOptions'].valuesPipe = { transform };
      component['internalOptions'].valuesPipeArgs = pipeArgs;

      const result = await component['translate'](sourceValue);

      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(sourceValue, pipeArgs[0], pipeArgs[1]);
      expect(result).toEqual(expectedValue);
    });
    it('should call translateService with passed value', async () => {
      const sourceValue = 'hello';
      const translatedValue = 'ciao';
      const mockedServiceTranslate = spyOn(component['_translateService'], 'get').and.returnValue(defer(() => Promise.resolve(translatedValue)));

      const result = await component['translate'](sourceValue);

      expect(mockedServiceTranslate).toHaveBeenCalledTimes(1);
      expect(mockedServiceTranslate).toHaveBeenCalledWith(sourceValue);
      expect(result).toEqual(translatedValue);
    });
  });
});
