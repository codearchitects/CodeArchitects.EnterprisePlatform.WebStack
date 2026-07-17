// import { DateParserService } from '../services/index';
// import { ShFormControl, ShFormControlMode, isPresent } from '../utilities/index';
// import moment from 'moment';

// function isInvalid(control: ShFormControl, parser: DateParserService, format: string) {
//   return (control.mode === ShFormControlMode.Edit && !parser.strictCheck(control.value))
//     || (control.mode === ShFormControlMode.Browse && !moment(control.value, format, true).isValid());
// }

// export function date(format: string) {
//   const parser = new DateParserService();

//   return (control: ShFormControl) => {
//     return isPresent(control.value) && isInvalid(control, parser, format) ?
//       { 'date': { 'actualValue': control.value } } :
//       null;
//   };
// }
