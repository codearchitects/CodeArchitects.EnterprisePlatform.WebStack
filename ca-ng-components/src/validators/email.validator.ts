import { Validators, ValidatorFn } from '@angular/forms';

export function email(): ValidatorFn {
  return Validators.pattern('^\\w+.*@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$');
}
