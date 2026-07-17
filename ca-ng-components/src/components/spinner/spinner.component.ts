import { AfterViewInit, Component, ElementRef, Injector, Input } from '@angular/core';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from './../base/index';

@FormDesignerControl({
  name: 'spinner',
  shortDescription: 'Spinner Control'
})
@Component({
  selector: 'sh-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
export class ShSpinnerComponent extends ShBaseAuthComponent<IShBaseOptions> implements AfterViewInit {
  /**
   * Specifies if spinner must be placed in front of all the other controls (with an overlay)
   */
  @Input() public isOverlay = false;
  /**
   * Specifies if spinner must be placed inline with other controls
   */
  @Input() public isInline = false;
  /**
   * Spinner element
   */
  private _element: ElementRef;

  constructor(injector: Injector) {
    super(injector);
    this._element = injector.get(ElementRef);
  }

  public ngAfterViewInit() {
    const spinner = $(this._element.nativeElement);
    if (this.isOverlay) {
      spinner.addClass('spinner-overlay');
      $('body').append(spinner);
    }
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    if (this.isOverlay) {
      $(this._element.nativeElement).remove();
    }
  }

}
