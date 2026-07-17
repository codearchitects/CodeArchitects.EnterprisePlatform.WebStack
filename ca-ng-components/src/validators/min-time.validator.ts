// import { ShFormControl, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid<T>(control: ShFormControl, min: moment.Moment) {
//   return moment(control.value, control.currentFormat) < min;
// }

// export function minTime(minValue: string) {
//   let min = moment(minValue, 'HH:mm');
//   if (!min.isValid()) {
//     min = moment();
//   }

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, min.startOf('m')) ?
//       { 'max': { 'minValue': minValue, 'actualValue': control.value } } :
//       null;
//   };
// }
