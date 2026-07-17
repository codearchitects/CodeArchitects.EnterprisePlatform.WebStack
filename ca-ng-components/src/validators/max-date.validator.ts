// import { ShFormControl, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid<T>(control: ShFormControl, max: moment.Moment) {
//   return moment(control.value, control.currentFormat) > max;
// }

// export function maxDate(maxValue?: string) {
//   let max = moment(maxValue, 'DD/MM/YYYY');
//   if (!max.isValid()) {
//     max = moment();
//   }

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, max.endOf('d')) ?
//       { 'max': { 'maxValue': maxValue, 'actualValue': control.value } } :
//       null;
//   };
// }
