import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShReactHostComponent } from './react/react.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ShReactHostComponent
  ],
  declarations: [
    ShReactHostComponent
  ]
})
export class ShReactComponentsModule { }
