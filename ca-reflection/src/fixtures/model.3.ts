import { CommonBase } from './model';
import { JsonObject } from '../reflection-decorators';
import { JsonProperty } from '../reflection-decorators';

@JsonObject({ name: 'Convert3' })
export class Convert3 extends CommonBase {
  // @JsonProperty({ debug: true })
  // @JsonProperty({
  //   transformation: {
  //     convertFrom: (from: string) => { console.log('##3##'); return from.substr(0, from.length - 1); },
  //     convertTo: to => { console.log('**3**'); return to + '3'; }
  //   }
  // })
  @JsonProperty()
  // @JsonProperty({
  //   // transformation: {
  //   //   convertFrom: from => from,
  //   //   convertTo: to => to
  //   // }
  // })
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}
