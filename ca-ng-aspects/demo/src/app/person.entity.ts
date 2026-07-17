import { Aspect } from '@ca-webstack/ng-aspects';

export class Person {

  @Aspect({
    default: {
      label: 'Nome'
    }
  })
  firstName: string;

}
