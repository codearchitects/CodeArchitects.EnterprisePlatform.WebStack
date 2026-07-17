import { ValidatorHelper, AspectHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from './form-handler.service';
// import { ToastService } from './toast.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdSequenceService } from './id-sequence.service';
import { TemplateDictionary, ShTemplate } from '../utilities/template-dictionary.utility';
import { TemplateMapperService } from './template-mapper.service';
import { ComplexTypeList, ShComplexType } from '../utilities/complex-type.list';
import { NumberParserService } from './number-parser.service';
import { AssetsService } from './assets.service';
import { HttpClientModule } from '@angular/common/http';
import { ShToastService } from './toast.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // ToastService,
    FormHandlerService,
    ValidatorHelper,
    IdSequenceService,
    NumberParserService,
    AssetsService,
    AspectHelper,
    ShToastService,
    { provide: TemplateDictionary, useValue: ShTemplate },
    { provide: ComplexTypeList, useValue: ShComplexType },
    TemplateMapperService
  ]
})
export class ShServicesModule { }
