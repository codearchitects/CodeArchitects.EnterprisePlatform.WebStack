import { CommonBase } from './model';
import { JsonObject, JsonProperty } from '../reflection-decorators';

@JsonObject({ name: 'Convert1' })
export class Convert1 extends CommonBase {
  @JsonProperty({
    debug: true,
    transformation: {
      convertFrom: (from: string) => { console.log('##1##'); return from.substr(0, from.length - 1); },
      convertTo: to => { console.log('**1**'); return to + '1'; }
    }
  })
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}
