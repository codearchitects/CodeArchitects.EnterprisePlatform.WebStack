import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShReactHostComponent } from './react/react.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    ShReactHostComponent
  ],
  declarations: [
    ShReactHostComponent
  ]
})
export class ShReactComponentsModule { }
