import { Validators } from '@angular/forms';
import { atLeastOne } from './at-least-one.validator';
import { dateRange } from './date-range.validator';
import { dateTime } from './date-time.validator';
import { email } from './email.validator';
import { maxNumber } from './max-number.validator';
import { minNumber } from './min-number.validator';
import { number } from './number.validator';
import { phone } from './phone.validator';
import * as _ from 'lodash-es';

export const ShValidators: any = _.merge(Validators, {
  atLeastOne,
  dateRange,
  dateTime,
  email,
  maxNumber,
  minNumber,
  number,
  phone
});

export { DateRangeForm } from './date-range.validator';
export { DateTimeForm } from './date-time.validator';