import { CommonBase } from './model';
import { JsonObject, JsonProperty } from '../reflection-decorators';

@JsonObject({ name: 'Convert2' })
export class Convert2 extends CommonBase {
  @JsonProperty({
    transformation: {
      convertFrom: (from: string) => { console.log('##2##'); return from.substr(0, from.length - 1); },
      convertTo: to => { console.log('**2**'); return to + '2'; }
    }
  })
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}
