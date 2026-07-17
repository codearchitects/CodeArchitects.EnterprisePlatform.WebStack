import { Validators } from '@angular/forms';
import { atLeastOne } from './at-least-one.validator';
// import { date } from './date.validator';
import { dateRange } from './date-range.validator';
import { dateTime } from './date-time.validator';
import { email } from './email.validator';
// import { maxDate } from './max-date.validator';
import { maxNumber } from './max-number.validator';
// import { maxTime } from './max-time.validator';
// import { minDate } from './min-date.validator';
import { minNumber } from './min-number.validator';
// import { minTime } from './min-time.validator';
import { number } from './number.validator';
import { phone } from './phone.validator';
// import { time } from './time.validator';
import * as _ from 'lodash';

export const ShValidators: any = _.merge(Validators, {
  atLeastOne,
  // date,
  dateRange,
  dateTime,
  email,
  // maxDate,
  maxNumber,
  // maxTime,
  // minDate,
  minNumber,
  // minTime,
  number,
  phone,
  // time
});
