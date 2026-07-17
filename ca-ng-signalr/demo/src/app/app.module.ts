import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Inizio import per demo
import { SignalRModule } from '@ca-webstack/ng-signalr';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SignalRModule.forRoot(environment.api, ['fakeHub'])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
