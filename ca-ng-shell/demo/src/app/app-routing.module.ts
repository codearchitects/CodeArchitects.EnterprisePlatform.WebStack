import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'internal', loadChildren: 'app/modules/internal/internal.module#InternalModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
