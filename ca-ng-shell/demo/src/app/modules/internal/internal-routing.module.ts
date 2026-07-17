import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalLandingComponent } from './components/internal-landing/internal-landing.component';

const routes: Routes = [
  { path: '', component: InternalLandingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalRoutingModule { }
