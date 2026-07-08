import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaepSidePanelService {
  /** Contains the current state of side panel */
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  /** This template that will be rendered in the sidebar content, in template context we provide the instance of service*/
  public template: TemplateRef<any> | null = null;
  /** Target of PointerEvent */
  public target: EventTarget | null = null;
  /** Observable of current state of side  panel */
  public isOpen$ = this._isOpen$.asObservable();
  /** Open panel */
  public open(event: Event, template: TemplateRef<any>) {
    this.target = event?.target || null;
    this.template = template;
    this._isOpen$.next(true);
  }
  /** Close panel */
  public close() {
    this.template = null;
    this._isOpen$.next(false);
  }
}
