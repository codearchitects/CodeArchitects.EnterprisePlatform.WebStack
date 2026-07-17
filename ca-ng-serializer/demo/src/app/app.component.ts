import { Component } from '@angular/core';
import { SerializerService } from '@ca-webstack/ng-serializer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    serializer: SerializerService
  ) {
    this.title = serializer.serialize({
      a: 1,
      b: 'c'
    });
  }

}
