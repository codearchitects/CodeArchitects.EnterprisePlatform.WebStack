import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { CaepTopbarItemPosition } from '../../models';
import { CaepTopbarService } from '../../services';

@Directive({
    selector: 'ng-template[caepTopbarItem]',
    standalone: false
})
export class CaepTopbarItemTemplateDirective<T = any> implements OnChanges, OnDestroy {
  //#region Inputs
  @Input() public id = UUID.UUID();
  @Input() public order: number;
  @Input() public icon: string;
  @Input() public priority: number;
  @Input() public position: CaepTopbarItemPosition;
  @Input() public containerClass: string | string[] | Observable<string | string[]>;
  @Input() public enable: boolean;
  @Input() public show: boolean;
  @Input() public resource: string;
  @Input() public ariaLabel: string;
  @Input() public ariaLabelledby: string;
  @Input() public handler: (evt: MouseEvent) => any;
  @Input() public templateContext: T;
  //#endregion
  constructor(private _templateRef: TemplateRef<T>, private _topbarService: CaepTopbarService) {}
  //#region Lifecycle
  ngOnChanges(changes: SimpleChanges) {
    if (changes.id) {
      if (changes.id.previousValue) {
        this._unregister(changes.id.previousValue);
      }
      this.id = this.id ?? UUID.UUID();
    }
    this._registerOrUpdate();
  }
  ngOnInit() {
    this._registerOrUpdate();
  }
  ngOnDestroy(): void {
    this._unregister();
  }
  //#endregion
  //#region Internal hooks
  private _registerOrUpdate() {
    this._topbarService.registerOrUpdate({
      id: this.id,
      order: this.order,
      ariaLabel: this.ariaLabel,
      ariaLabelledby: this.ariaLabelledby,
      containerClass: this.containerClass,
      enable: this.enable,
      handler: this.handler,
      icon: this.icon,
      position: this.position,
      priority: this.priority,
      resource: this.resource,
      show: this.show,
      templateContext: this.templateContext,
      templateRef: this._templateRef
    });
  }
  private _unregister(id?: string) {
    this._topbarService.unregister(id ?? this.id);
  }
  //#endregion
}
