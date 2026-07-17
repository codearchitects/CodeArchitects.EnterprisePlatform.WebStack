import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CaShellModule } from '@ca-webstack/ng-shell';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { LandingComponent } from './components/landing/landing.component';

@NgModule({
  declarations: [
    RootComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    CaShellModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
