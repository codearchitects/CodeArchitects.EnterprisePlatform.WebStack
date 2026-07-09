import {
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Inject,
  Injector,
  QueryList,
  ViewChild
} from '@angular/core';
import { CaepContentChild, CaepContentChildren, CaepOption } from '../../decorators';
import { CAEP_OPTIONS_TOKEN } from '../../tokens';
import { PickAll } from '../../utilities';
import { CaepBaseLookupMultiComponent, CaepBaseLookupMultiOptions, ICaepLookupMulti } from '../base';
import { MockTextComponent } from '../mock-text/mock-text.component';
import { CaepOptionComponent } from '../option/option.component';

export interface IMockMultiSelectOptions<T, V> extends PickAll<MockMultiSelectOptions<T, V>> {}

export class MockMultiSelectOptions<T, V> extends CaepBaseLookupMultiOptions<T, V> {
  /**
   * Dropdown width
   */
  dropdownWidth?: string;

  /**
   * Dropdown height
   */
  @CaepOption({ defaultValue: '150px' })
  dropdownHeight?: string;

  constructor(options?: IMockMultiSelectOptions<T, V>) {
    super(options);
  }
}

@Component({
    selector: 'caep-mock-multiselect',
    template: `
    @if (show && formControl) {
      <div [class]="containerClass">
        <div
          #input
          [id]="id"
          [class]="options.inputClass"
          [attr.tabindex]="tabindex"
          [attr.autofocus]="autofocus || null"
          [style.minWidth]="width"
          [style.height]="height"
          (focusout)="!formControl.touched && formControl.markAsTouched()"
        >
          @if (formControl.value !== undefined) {
            <div>
              @for (label of selectedLabels; track label; let i = $index) {
                @if (i > 0) {
                  -
                }
                {{ label }}
              }
            </div>
          }
        </div>
        @if (options.placeholder) {
          <label [attr.for]="id">{{ options.placeholder }}</label>
        }
        <div [style.maxHeight]="options.dropdownHeight">
          <ul #results>
            @for (value of values; track value.id) {
              <li (click)="onSelectValue(value)">
                <span [id]="value.id">{{ value.label }}</span>
              </li>
            }
            <ng-content select="[footer]"></ng-content>
          </ul>
        </div>
      </div>
    }
    `,
    providers: [
        {
            provide: CAEP_OPTIONS_TOKEN,
            useValue: (value?: any) => new MockMultiSelectOptions(value)
        }
    ],
    standalone: false
})
export class MockMultiSelectComponent<
  T,
  V,
  O extends MockMultiSelectOptions<T, V>
> extends CaepBaseLookupMultiComponent<T, V, O> {
  @CaepContentChild(CaepOptionComponent)
  @ContentChild(CaepOptionComponent)
  public firstOption: CaepOptionComponent<V>;

  @CaepContentChild(MockTextComponent)
  @ContentChild(MockTextComponent)
  public testIncorrectSelector: MockTextComponent;

  @CaepContentChildren(CaepOptionComponent, { descendants: true })
  @ContentChildren(CaepOptionComponent, { descendants: true })
  public testDescendants: QueryList<CaepOptionComponent<V>>;

  @ViewChild('results')
  public set results(listRef: ElementRef) {
    if (listRef) {
      const list = listRef.nativeElement as HTMLUListElement;
      this._results = list.children;
    }
  }

  public _results: HTMLCollection;

  public get dropdownWidth() {
    let width = 'auto';
    const input: HTMLDivElement = this._input && this._input.nativeElement;
    if (this.options.dropdownWidth) {
      width = this.options.dropdownWidth;
    } else if (input) {
      width = `${input.clientWidth}px`;
    }
    return width;
  }

  public element: ElementRef;

  @ViewChild('input')
  private _input: ElementRef;

  constructor(injector: Injector, @Inject(CAEP_OPTIONS_TOKEN) optionsCtor: (value?: PickAll<O>) => O) {
    super(injector, optionsCtor);
    this.element = injector.get(ElementRef);
  }

  public onSelectValue(value: ICaepLookupMulti<V>) {
    value.formControl.setValue(!value.formControl.value);
    this.markAsDirty();
  }
}
