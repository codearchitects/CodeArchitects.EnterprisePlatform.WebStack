import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Inizio import per demo
import { AspectsModule } from '@ca-webstack/ng-aspects';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AspectsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
