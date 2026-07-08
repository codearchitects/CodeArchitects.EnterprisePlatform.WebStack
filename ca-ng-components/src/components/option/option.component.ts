import { IShBaseOptions } from '../base/base.component';
import { ShBaseAuthComponent } from '../base/base-auth.component';
import { Component, ContentChild, Injector, Input, ElementRef, AfterContentInit } from '@angular/core';
import * as _ from 'lodash-es';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';

@Component({
    selector: 'sh-option',
    template: '<ng-content></ng-content>',
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base option component
 */
export class ShOptionComponent<T> extends ShBaseAuthComponent<IShBaseOptions> implements AfterContentInit {
  /**
   * Option value
   */
  @Input() public value: T;
  /**
   * Option text
   */
  @Input() public text: string;
  /**
   * Option unique key property
   */
  @Input() public key: string;
  /**
   * Host element reference
   */
  private _elementRef: ElementRef<HTMLElement>;

  /**
   * Base option component
   */
  constructor(injector: Injector) {
    super(injector);
    this._elementRef = injector.get(ElementRef);
  }

  public ngAfterContentInit() {
    this.text = this._elementRef?.nativeElement?.innerText;
  }

}
