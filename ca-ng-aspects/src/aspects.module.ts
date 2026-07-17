import { NgModule } from '@angular/core';
import {
  AspectHelper,
  ContextService,
  ValidatorHelper
} from './services/index';

@NgModule({
  providers: [
    AspectHelper,
    ContextService,
    ValidatorHelper
  ]
})
export class AspectsModule { }
