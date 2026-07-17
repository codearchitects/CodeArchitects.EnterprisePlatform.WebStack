// import { TimeParserService } from '../services/index';
// import { ShFormControl, ShFormControlMode, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid(control: ShFormControl, parser: TimeParserService, format: string) {
//   return (control.mode === ShFormControlMode.Edit && !parser.strictCheck(control.value))
//     || (control.mode === ShFormControlMode.Browse && !moment(control.value, format, true).isValid());
// }

// export function time(format: string) {
//   const parser = new TimeParserService();

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, parser, format) ?
//       { 'time': { 'actualValue': control.value } } :
//       null;
//   };
// }
