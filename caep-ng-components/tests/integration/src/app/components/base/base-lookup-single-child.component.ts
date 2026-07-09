import { Component, ElementRef, Inject, Injector, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { CAEP_OPTIONS_TOKEN, CaepBaseLookupSingleComponent, CaepBaseLookupSingleOptions, CaepOption, CaepPipe, PickAll } from '@ca-webstack/ng-components-extra';

@CaepPipe({
    name: 'person'
})
@Pipe({
    name: 'person',
    standalone: false
})
export class PersonPipe implements PipeTransform {
    transform(value: { name: string; surname: string }, concat: string): any {
      return value ? `${value.name} ${value.surname} +++++ ${concat}` : '';
    }
}

@CaepPipe({
  name: 'personInverse'
})
@Pipe({
    name: 'personInverse',
    standalone: false
})
export class InversePersonPipe implements PipeTransform {
  transform(value: { name: string; surname: string }, concat: string): any {
    return `${value.surname} ${value.name} +++++ ${concat}`;
  }
}

export interface IBaseLookupSingleChildOptions<T, V> extends PickAll<BaseLookupSingleChildOptions<T, V>> { }

export class BaseLookupSingleChildOptions<T, V> extends CaepBaseLookupSingleOptions<T, V> {

  /**
   * Dropdown width
   */
  dropdownWidth?: string;

  /**
   * Dropdown height
   */
  @CaepOption({ defaultValue: '150px' })
  dropdownHeight?: string;

  constructor(options?: IBaseLookupSingleChildOptions<T, V>) {
      super(options);
  }

}

@Component({
    selector: 'app-base-lookup-single-child',
    template: `
    @if (show && formControl) {
      <div [class]="containerClass" [style.minWidth]="width">
        <div #input [id]="id" [class]="options.inputClass" [attr.tabindex]="tabindex" [attr.autofocus]="autofocus || null" [style.height]="height" (focusout)="!formControl.touched && formControl.markAsTouched()">
          @if (formControl.value !== undefined) {
            <div>{{ selectedLabel }}</div>
          }
        </div>
        @if (options.placeholder) {
          <label [attr.for]="id">{{ options.placeholder }}</label>
        }
        <div [style.maxHeight]="options.dropdownHeight">
          <ul #results>
            @for (value of values; track value.id) {
              <li (click)="onSelectValue(value.ref)">
                <span [id]="value.id">{{value.label}}</span>
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
            useValue: (value?: any) => new BaseLookupSingleChildOptions(value)
        }
    ],
    standalone: false
})
export class BaseLookupSingleChildComponent<T, V, O extends BaseLookupSingleChildOptions<T, V>> extends CaepBaseLookupSingleComponent<T, V, O> {

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

  constructor(
    injector: Injector,
    @Inject(CAEP_OPTIONS_TOKEN) optionsCtor: (value?: PickAll<O>) => O
  ) {
    super(injector, optionsCtor);
    this.element = injector.get(ElementRef);
  }

  public onSelectValue(value: V) {
    this.setControlValue(value);
    this.markAsDirty();
  }

}