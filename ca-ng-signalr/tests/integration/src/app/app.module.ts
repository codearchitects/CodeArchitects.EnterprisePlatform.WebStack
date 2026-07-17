import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SignalRModule } from '@ca-webstack/ng-signalr';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SignalRModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
