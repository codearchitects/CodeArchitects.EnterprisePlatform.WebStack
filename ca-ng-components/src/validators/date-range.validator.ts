import { AbstractControl, FormGroup } from '@angular/forms';

export interface DateRangeForm {
  start: AbstractControl<any>,
  end: AbstractControl<any>
}

function isInvalid(group: FormGroup<DateRangeForm>) {
  return (group.contains('start') && group.controls.start.hasError('date'))
    || (group.contains('end') && group.controls.end.hasError('date'));
}

export function dateRange(group: FormGroup<DateRangeForm>) {
  return isInvalid(group) ?
    { 'dateRange': { 'actualValue': group.value } } :
    null;
}
