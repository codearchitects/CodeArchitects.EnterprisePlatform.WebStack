import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataContextModule } from '@ca-webstack/ng-data-context';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DataContextModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
