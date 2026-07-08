import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AspectHelper, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { CaepPipeDictionary, CaepTemplate, CaepTemplateDictionary, caepPipes } from '../utilities';
import { CaepFormHandlerService } from './form-handler.service';
import { CaepIdSequenceService } from './id-sequence.service';
import { CaepNumberParserService } from './number-parser.service';
import { CaepPipeMapperService } from './pipe-mapper.service';
import { CaepTemplateMapperService } from './template-mapper.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    CaepIdSequenceService,
    CaepFormHandlerService,
    ValidatorHelper,
    AspectHelper,
    CaepNumberParserService,
    { provide: CaepPipeDictionary, useValue: caepPipes },
    { provide: CaepTemplateDictionary, useValue: CaepTemplate },
    CaepPipeMapperService,
    CaepTemplateMapperService
  ]
})
export class CaepServicesModule {}
