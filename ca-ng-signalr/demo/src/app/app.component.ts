import { Component } from '@angular/core';
import { SignalRService } from '@ca-webstack/ng-signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    signalr: SignalRService
  ) {
    signalr.on<string>('fakeHub', 'fakeEvent')
      .subscribe(arg => console.log(arg));
    signalr.invoke('fakeHub', 'fakeMethod', 'fakeArgument');
  }

}
