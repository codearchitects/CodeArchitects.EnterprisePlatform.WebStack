import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShDropdownDirective } from './dropdown.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShDropdownDirective],
  exports: [ShDropdownDirective]
})
export class ShDirectivesModule { }
