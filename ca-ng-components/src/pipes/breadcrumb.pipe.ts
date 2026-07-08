import { IShBreadcrumbStackFrame } from "../components/breadcrumb/interface";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "breadcrumb",
    standalone: false
})
export class ShBreadcrumbPipe implements PipeTransform {
  transform(frame: IShBreadcrumbStackFrame): string[] {
    const routerLink = [];
    if (frame) {
      routerLink.push('/', ...frame.application, ...frame.domain, ...frame.scenario, ...frame.action);
    }
    return routerLink;
  }
}
