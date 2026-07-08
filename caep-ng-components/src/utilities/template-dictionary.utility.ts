import { Type } from '@angular/core';
import { MockMultiSelectComponent } from '../components/mock-multiselect/mock-multiselect.component';
import { CaepTextComponent } from '../components/text';

export class CaepTemplateDictionary {
  [key: string]: Type<any>;
}

export const CaepTemplate: CaepTemplateDictionary = {
  'MOCK-MULTISELECT': MockMultiSelectComponent,
  TEXT: CaepTextComponent
};
