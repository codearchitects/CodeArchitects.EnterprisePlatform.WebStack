import { NgModule } from '@angular/core';
import { RouteGuard } from './services/route.guard';
import { RouterModule } from '@angular/router';
import { DataContextModule } from '@ca-webstack/ng-data-context';

@NgModule({
  imports: [
    DataContextModule
  ],
  providers: [
    RouteGuard,
    // TaskRouteGuard,
    RouterModule
  ]
})
export class CaShellModule { }
