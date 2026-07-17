import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CaShellModule } from '@ca-webstack/ng-shell';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CaShellModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
