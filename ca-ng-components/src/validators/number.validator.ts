import { TranslateService } from '@ngx-translate/core';
import { NumberParserService } from '../services/index';
import { ShFormControl, ShFormControlMode, isPresent } from '../utilities/index';
import { shNumeral } from '../utilities/numeral.utility';

function isInvalid(control: ShFormControl, parser: NumberParserService, allowNegative: boolean, decimalPlaces: number, format: string) {
  return (control.mode === ShFormControlMode.Edit && !parser.strictCheck(control.value, allowNegative, decimalPlaces))
    || (control.mode === ShFormControlMode.Browse && shNumeral.set(control.value).format(format) !== control.value);
}

export function number(allowNegative: boolean, decimalPlaces: number, format: string, translateService: TranslateService) {
  const parser = new NumberParserService(translateService);

  return (control: ShFormControl) => {
    return isPresent(control.value) && isInvalid(control, parser, allowNegative, decimalPlaces, format) ?
      { 'number': { 'actualValue': control.value } } :
      null;
  };
}
