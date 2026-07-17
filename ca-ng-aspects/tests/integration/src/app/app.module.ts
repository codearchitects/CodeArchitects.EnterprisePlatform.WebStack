import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AspectsModule } from '@ca-webstack/ng-aspects';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AspectsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
