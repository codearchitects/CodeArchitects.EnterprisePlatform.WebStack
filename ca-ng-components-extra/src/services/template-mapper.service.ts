import { Injectable, Type } from '@angular/core';
import { CaepTemplateDictionary } from '../utilities/template-dictionary.utility';

@Injectable(/*{ providedIn: 'root' }*/)
export class CaepTemplateMapperService {
  constructor(public templates: CaepTemplateDictionary) {}

  findTemplateByName(templateName = 'TEXT'): Type<any> {
    let template = this.templates[templateName.toUpperCase()];
    if (!template) {
      console.warn('Template not found: ', templateName, '. Used `TEXT` instead.');
      template = this.templates['TEXT'];
    }
    return template;
  }
}
