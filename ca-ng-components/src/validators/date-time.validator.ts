import { AbstractControl, FormGroup } from '@angular/forms';

export interface DateTimeForm {
  date: AbstractControl<any>,
  time: AbstractControl<any>
}

function isInvalid(group: FormGroup<DateTimeForm>) {
  return (group.contains('date') && group.controls.date.hasError('date'))
    || (group.contains('time') && group.controls.time.hasError('time'));
}

export function dateTime(group: FormGroup<DateTimeForm>) {
  return isInvalid(group) ?
    { 'dateTime': { 'actualValue': group.value } } :
    null;
}
