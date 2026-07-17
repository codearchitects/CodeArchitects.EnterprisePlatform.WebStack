import { FormGroup } from '@angular/forms';

function isInvalid(group: FormGroup) {
  return (group.contains('date') && group.controls['date'].hasError('date'))
    || (group.contains('time') && group.controls['time'].hasError('time'));
}

export function dateTime(group: FormGroup) {
  return isInvalid(group) ?
    { 'dateTime': { 'actualValue': group.value } } :
    null;
}
