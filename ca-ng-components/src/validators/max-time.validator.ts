// import { ShFormControl, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid<T>(control: ShFormControl, max: moment.Moment) {
//   return moment(control.value, control.currentFormat) > max;
// }

// export function maxTime(maxValue: string) {
//   let max = moment(maxValue, 'HH:mm');
//   if (!max.isValid()) {
//     max = moment();
//   }

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, max.endOf('m')) ?
//       { 'max': { 'maxValue': maxValue, 'actualValue': control.value } } :
//       null;
//   };
// }
