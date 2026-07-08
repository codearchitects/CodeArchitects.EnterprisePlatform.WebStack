import { Pipe, PipeTransform } from '@angular/core';
import { ICaepTopbarItem } from '../models';

@Pipe({
    name: 'topbarItemTemplateContext',
    standalone: false
})
export class CaepTopbarItemTemplateContextPipe implements PipeTransform {
  transform(model: ICaepTopbarItem): any {
    if (!model) return null;
    if (!model.templateContext) return { $implicit: model };
    return { $implicit: model, ...model.templateContext }; // model as implicit is left overridable on purpose, devs may do not want it and use their implicits
  }
}
