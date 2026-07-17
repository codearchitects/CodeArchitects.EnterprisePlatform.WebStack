import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaShellModule } from '@ca-webstack/ng-shell';
import { InternalRoutingModule } from './internal-routing.module';
import { InternalLandingComponent } from './components/internal-landing/internal-landing.component';

@NgModule({
  declarations: [
    InternalLandingComponent
  ],
  imports: [
    CommonModule,
    CaShellModule,
    InternalRoutingModule
  ]
})
export class InternalModule { }
