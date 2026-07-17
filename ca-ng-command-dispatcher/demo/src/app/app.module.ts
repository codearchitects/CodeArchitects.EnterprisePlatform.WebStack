import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommandDispatcherModule } from '@ca-webstack/ng-command-dispatcher';

//Inizio import per demo

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommandDispatcherModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
