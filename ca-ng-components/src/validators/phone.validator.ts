import { Validators, ValidatorFn } from '@angular/forms';

export function phone(): ValidatorFn {
  return Validators.pattern('^(\\+[0-9 ]{2})?(\\([0-9 ]{3}\\))?([\\ |\\-|\\.]?)([0-9 ]*)$');
}
