import { Component } from '@angular/core';
import { DataContextService } from '@ca-webstack/ng-data-context';
import { Person } from './person.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    datacontext: DataContextService
  ) {
    let p1 = new Person('abc', 'Pinco', 'Pallino');
    p1 = datacontext.attach(p1);
    let p2 = new Person('abc', 'Tizio', 'Caio');
    p2 = datacontext.attach(p2);
    this.title = String(p1 === p2);
  }

}
