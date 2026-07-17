import { ShFormControl, isPresent } from '../utilities/index';
import { shNumeral } from '../utilities/numeral.utility';

function isInvalid<T>(control: ShFormControl, max: number) {
  return shNumeral.set(control.value).value() > max;
}

export function maxNumber(maxValue: string) {
  const max = shNumeral.set(maxValue).value();

  return (control: ShFormControl) => {
    return isPresent(control.value) && isInvalid(control, max) ?
      { 'max': { 'maxValue': maxValue, 'actualValue': control.value } } :
      null;
  };
}
