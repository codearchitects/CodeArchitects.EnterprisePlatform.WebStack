import { FormGroup } from '@angular/forms';

function isInvalid(group: FormGroup, keys: string[]) {
  return keys.reduce((memo, key) => memo && group.controls[key] && !group.controls[key].value, true);
}

export function atLeastOne(...keys: string[]) {
  return (group: FormGroup) => {
    return isInvalid(group, keys) ?
      { 'atLeastOne': { 'fields': keys } } :
      null;
  };
}
