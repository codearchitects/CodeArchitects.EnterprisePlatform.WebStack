import { NgModule } from '@angular/core';
import {
  AspectHelper,
  ContextService
} from './services/index';

@NgModule({
  providers: [
    AspectHelper,
    ContextService
  ]
})
export class AspectsModule { }
