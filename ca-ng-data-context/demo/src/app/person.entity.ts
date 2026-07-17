import { Entity } from '@ca-webstack/data-context';

@Entity({ name: 'Person', keys: 'id' })
export class Person {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
  ) { }
}
