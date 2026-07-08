import { CommonBase } from './model';
import { JsonObject, JsonProperty } from '../reflection-decorators';

@JsonObject({ name: 'Convert4' })
export class Convert4 extends CommonBase {
  @JsonProperty({
    transformation: {
      convertFrom: (from: string) => { console.log('##4##'); return from.substr(0, from.length - 1); },
      convertTo: to => { console.log('**4**'); return to + '4'; }
    }
  })
  // @JsonProperty( {debug: true} )
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}

