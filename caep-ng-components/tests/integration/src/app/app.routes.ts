import { GridViewerComponent } from './components/grid-viewer/grid-viewer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorsPageComponent } from './components/colors-page/colors-page.component';
import { ColumnsExamplePageComponent } from './components/columns-example-page/columns-example-page.component';

const routes: Routes = [
    { path: "componentA", loadChildren: () => import('./components/lazyA/lazyA.module').then(m => m.LazyAModule) },
    { path: "componentB", loadChildren: () => import('./components/lazyB/lazyB.module').then(m => m.LazyBModule) },
    { path: 'columns', component: ColumnsExamplePageComponent },
    { path: 'colors', component: ColorsPageComponent },
    { path: 'grid', component: GridViewerComponent },
  // { path: '', redirectTo: 'columns', pathMatch: 'full' },
  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
