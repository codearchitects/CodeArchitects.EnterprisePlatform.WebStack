import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataContextModule } from '@ca-webstack/ng-data-context';

@NgModule({
  imports: [
    DataContextModule
  ],
  providers: [
    // TaskRouteGuard,
    RouterModule
  ]
})
export class CaShellModule { }
