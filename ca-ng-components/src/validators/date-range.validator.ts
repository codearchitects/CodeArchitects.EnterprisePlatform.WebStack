import { FormGroup } from '@angular/forms';

function isInvalid(group: FormGroup) {
  return (group.contains('start') && group.controls['start'].hasError('date'))
    || (group.contains('end') && group.controls['end'].hasError('date'));
}

export function dateRange(group: FormGroup) {
  return isInvalid(group) ?
    { 'dateRange': { 'actualValue': group.value } } :
    null;
}
