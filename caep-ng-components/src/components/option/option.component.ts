import { Component, ElementRef, Injector, Input } from '@angular/core';
import { CaepHook, CaepHookType } from '../../decorators';
import { caepChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { CaepBaseAuthComponent } from '../base/base-auth.component';

/**
 * Base option component
 */
@Component({
    selector: 'caep-option',
    template: '<ng-content></ng-content>',
    changeDetection: caepChangeDetectorStrategy(),
    standalone: false
})
export class CaepOptionComponent<T> extends CaepBaseAuthComponent {
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

  @CaepHook({ type: CaepHookType.AfterContentInit })
  private initializeText() {
    this.text = this._elementRef?.nativeElement?.innerText;
  }
}
