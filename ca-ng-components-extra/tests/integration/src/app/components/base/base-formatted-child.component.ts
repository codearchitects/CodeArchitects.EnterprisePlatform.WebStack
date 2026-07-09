import { Component, Injector, Pipe } from '@angular/core';
import { CaepBaseFormattedComponent, CaepBaseFormattedOptions, CaepCoercionType, CaepFormControlMode, CaepNumberParserService, caepNumeral, CaepOption, CaepPipe, CaepPipeTransform, PickAll } from '@ca-webstack/ng-components-extra';

export interface IMyCurrencyArgs {
  format: string;
  editFormat: string;
  allowNegative: boolean;
  maximumFractionDigits: number;
}

@CaepPipe({
    name: 'myCurrency'
})
@Pipe({
    name: 'myCurrency',
    standalone: false
})
export class MyCurrencyPipe extends CaepPipeTransform<number, string, IMyCurrencyArgs> {

    public numberParser: CaepNumberParserService;

    constructor(injector: Injector) {
      super();
      this.numberParser = injector.get(CaepNumberParserService);
    }

    transform(value: number, mode: CaepFormControlMode, args: IMyCurrencyArgs): string {
      const format = mode === CaepFormControlMode.Browse ? args.format : args.editFormat;
      return value !== undefined ? caepNumeral.set(value).format(format) : undefined;
    }

    revert(value: string, mode: CaepFormControlMode, args: IMyCurrencyArgs): number {
      if(mode === CaepFormControlMode.Browse) {
        //return this.getModelValue()
      } else {
        if (this.numberParser.strictCheck(value, args.allowNegative, args.maximumFractionDigits)) {
          let modelValue = this.numberParser.strictParse(value, args.allowNegative, args.maximumFractionDigits);
          return modelValue;
        }
        return undefined;
      }
    }

    tolerantCheck(value: string, mode: CaepFormControlMode, args: IMyCurrencyArgs): boolean {
      return this.numberParser.tolerantCheck(value, args.allowNegative, args.maximumFractionDigits);
    }
    
}

export interface IBaseFormattedChildOptions extends PickAll<BaseFormattedChildOptions> {};

export class BaseFormattedChildOptions extends CaepBaseFormattedOptions<number, IMyCurrencyArgs> {

  @CaepOption({ defaultValue: 1, coercionType: CaepCoercionType.Number })
  step?: number | string;

  //format: string = '' //possible problem

  constructor(options?: IBaseFormattedChildOptions) {
    super(options);
  }

}

@Component({
    selector: 'app-base-formatted-child',
    template: `
    @if (show) {
      <input #controlRef [attr.autofocus]="autofocus || null" type="text" [class]="options.inputClass" (focusin)="onFocusIn($event)" (focusout)="onFocusOut($event)"
      [id]="id" [formControl]="formControl" [attr.tabindex]="tabindex" [attr.maxlength]="options.maxLength || null" [attr.readonly]="options.isReadonly || null"
      [placeholder]="options.placeholder" autocomplete="off" [style.minWidth]="width" [style.maxWidth]="width" [style.height]="height">
    }
    `,
    standalone: false
})
export class BaseFormattedChildComponent extends CaepBaseFormattedComponent<number, BaseFormattedChildOptions> {

  constructor(injector: Injector) {
    super(injector, (value?: IBaseFormattedChildOptions) => new BaseFormattedChildOptions(value));
  }

  tolerantCheck(): boolean {
    throw new Error('Method not implemented.');
  }

  parseControlValue(): number {
    throw new Error('Method not implemented.');
  }

  formatModelValue(): string {
    throw new Error('Method not implemented.');
  }

  onKeyDown() { //TODO

  }

}