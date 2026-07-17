import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommandDispatcherModule } from '@ca-webstack/ng-command-dispatcher';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommandDispatcherModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
