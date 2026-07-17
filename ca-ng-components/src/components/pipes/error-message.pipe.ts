import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { Mstring } from '@ca-webstack/ng-i18n';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';

export interface IShMessages {
  [key: string]: string | Mstring;
}

@Pipe({ name: 'errorMessage', pure: true })
export class ErrorMessagePipe
  implements PipeTransform {

  private errorMap: IShMessages = {
    'number': { key: 'NUMBER_ERR', default: 'Il numero non è corretto' },
    'date': { key: 'DATE_ERR', default: 'La data non è corretta' },
    'dateRange': { key: 'DATERANGE_ERR', default: 'Le date del range non sono corrette' },
    'dateTime': { key: 'DATETIME_ERR', default: 'La data e l\'orario non sono corretti' },
    'pattern': { key: 'PATTERN_ERR', default: 'Il valore inserito non è valido' },
    'time': { key: 'TIME_ERR', default: 'L\'orario non è corretto' }
  };

  public constructor(
    private validatorHelper: ValidatorHelper
  ) { }

  public transform(error: string, messages: IShMessages, control: FormControl, model: any, prop?: string) {
    let message = this.validatorHelper.getMessage(control, error, model, prop);
    if (!message) {
      messages = _.merge({}, this.errorMap, messages);
      if ((<any>Object.keys(messages)).includes(error)) {
        message = messages[error];
      }
    }
    return message;
  }
}

@Pipe({ name: 'warningMessage', pure: true })
export class WarningMessagePipe
  implements PipeTransform {

  private warningMap: IShMessages = {
    'number': { key: 'NUMBER_ERR', default: 'Il numero non è corretto' },
    'date': { key: 'DATE_ERR', default: 'La data non è corretta' },
    'dateRange': { key: 'DATERANGE_ERR', default: 'Le date del range non sono corrette' },
    'dateTime': { key: 'DATETIME_ERR', default: 'La data e l\'orario non sono corretti' },
    'pattern': { key: 'PATTERN_ERR', default: 'Il valore inserito non è valido' },
    'time': { key: 'TIME_ERR', default: 'L\'orario non è corretto' }
  };

  public constructor(
    private validatorHelper: ValidatorHelper
  ) { }

  public transform(warning: string, messages: IShMessages, control: FormControl, model: any, prop?: string) {
    let message = this.validatorHelper.getWarningMessage(control, warning, model, prop);
    if (!message) {
      messages = _.merge({}, this.warningMap, messages);
      if ((<any>Object.keys(messages)).includes(warning)) {
        message = messages[warning];
      }
    }
    return message;
  }
}
