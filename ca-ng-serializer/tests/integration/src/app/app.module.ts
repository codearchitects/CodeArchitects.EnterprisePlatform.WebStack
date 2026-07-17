import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SerializerModule } from '@ca-webstack/ng-serializer';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SerializerModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
