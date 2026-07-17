import { ShFormControl, isPresent } from '../utilities/index';
import { shNumeral } from '../utilities/numeral.utility';

function isInvalid(control: ShFormControl, min: number) {
  const controlValue = typeof control.value === 'string' ? control.value.replace(/%/g, '') : control.value;
  return shNumeral.set(controlValue).value() < min;
}

export function minNumber(minValue: string) {
  const min = shNumeral.set(minValue).value();

  return (control: ShFormControl) => {
    return isPresent(control.value) && isInvalid(control, min) ?
      { 'min': { 'minValue': minValue, 'actualValue': control.value } } :
      null;
  };
}
