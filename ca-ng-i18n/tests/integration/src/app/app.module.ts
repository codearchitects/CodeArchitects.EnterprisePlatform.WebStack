import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    I18nModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
