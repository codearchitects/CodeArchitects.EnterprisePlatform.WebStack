import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Inizio import per demo
import { SerializerModule } from '@ca-webstack/ng-serializer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SerializerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
