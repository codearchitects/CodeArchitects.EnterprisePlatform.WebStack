import { IShBreadcrumbStackFrame } from './../index';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breadcrumb'
})
export class ShBreadcrumbPipe implements PipeTransform {

  transform(frame: IShBreadcrumbStackFrame): string[] {
    const routerLink = [];
    if (frame) {
      routerLink.push(...frame.domain, ...frame.scenario, ...frame.action);
    }
    return routerLink;
  }

}
