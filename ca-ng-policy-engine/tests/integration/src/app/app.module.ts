import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PolicyEngineModule } from '@ca-webstack/ng-policy-engine';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    PolicyEngineModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
