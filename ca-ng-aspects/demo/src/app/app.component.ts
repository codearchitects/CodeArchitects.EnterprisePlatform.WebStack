import { Component } from '@angular/core';
import { AspectsModule, AspectHelper } from '@ca-webstack/ng-aspects';

import { Person } from './person.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    aspect: AspectsModule
  ) {
    let person = new Person();
    this.title = new AspectHelper().getLabel(person, 'firstName');
  }
}
