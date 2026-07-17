// import { ShFormControl, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid<T>(control: ShFormControl, min: moment.Moment) {
//   return moment(control.value, control.currentFormat) < min;
// }

// export function minDate(minValue: string) {
//   let min = moment(minValue, 'DD/MM/YYYY');
//   if (!min.isValid()) {
//     min = moment();
//   }

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, min.startOf('d')) ?
//       { 'max': { 'minValue': minValue, 'actualValue': control.value } } :
//       null;
//   };
// }
