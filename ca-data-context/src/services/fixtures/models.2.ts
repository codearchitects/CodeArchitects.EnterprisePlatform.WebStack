import { Major } from './models';
import { Entity } from "../../decorators";

@Entity({
  name: 'myCity',
  keys: 'id'
})
export class City {
  constructor(
    public id: string,
    public name: string,
    public major?: Major
  ) { }
}
