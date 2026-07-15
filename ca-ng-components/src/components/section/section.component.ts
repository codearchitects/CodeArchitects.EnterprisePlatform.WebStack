import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
    selector: 'sh-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShSectionComponent extends ShBaseAuthComponent<IShBaseOptions> implements OnChanges {
  /**
   * The title of the section.
   * If not specified, the section results not collapsible
   */
  @Input() public title: string;
  /**
   * Specifies whether the section should positions itself inline with other sections
   */
  @Input() public isInline = true;
  /**
   * Specifies whether the section is collapsible
   */
  @Input() public isCollapsible = true;
  /**
   * Specifies whether section is collapsed
   */
  @Input() public collapsed = false;
  /**
   * ARIA heading level (aria-level) exposed for the section header when it
   * behaves as a disclosure toggle. Defaults to 2. Override to match the host
   * page's document outline and avoid skipped/out-of-order heading levels
   * (WCAG 1.3.1), which the component cannot detect from inside the library.
   */
  @Input() public headingLevel = 2;
  /**
   * Event fired on collapsed property changes
   */
  @Output() public collapsedChange = new EventEmitter<boolean>();
  /**
   * References to component element
   */
  private _elementRef: ElementRef;
  /**
   * Specifies if the control is enabled
   */
  private _enabled = true;

  /**
   * Input Fields Header Component
   */
  constructor(injector: Injector) {
    super(injector);
    this._elementRef = injector.get(ElementRef);
    Object.defineProperty(this, 'enable', {
      get: () => {
        return !!this._enabled;
      },
      set: (value: boolean) => {
        this._enabled = value;
        const element = $(this._elementRef.nativeElement);
        const body = element && element.find('.section-body');
        if (body) {
          const controls = body.find('[tabindex]').toArray() || [];
          if (controls.length) {
            if (this.enable) {
              controls.forEach((ctrl: any) => {
                const tabIndex = ctrl['defaultTabIndex'];
                if (tabIndex !== undefined) {
                  ctrl.tabIndex = tabIndex;
                }
              });
            } else {
              controls.forEach((ctrl: any) => {
                const tabIndex = ctrl['defaultTabIndex'];
                if (tabIndex === undefined) {
                  ctrl['defaultTabIndex'] = ctrl.tabIndex;
                }
                ctrl.tabIndex = -1;
              });
            }
          }
        }
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes && changes['isInline']) {
      const element = $(this._elementRef.nativeElement);
      if (this.isInline) {
        element.attr('inline', '');
      } else {
        element.removeAttr('inline');
      }
    }
  }

  /**
   * Whether the header behaves as a disclosure toggle
   * (i.e. it is both collapsible and has a title, so it is actually rendered/interactive).
   */
  public get isToggle(): boolean {
    return !!(this.title && this.isCollapsible);
  }

  /**
   * Toggles section
   */
  /*protected*/ public toggle() {
    if (this.title && this.isCollapsible) {
      this.collapsedChange.emit(this.collapsed = !this.collapsed);
    }
  }

  /**
   * Keyboard equivalent of clicking the header: activates the toggle on Enter/Space.
   */
  public onHeaderKeydown(event: KeyboardEvent): void {
    if (!this.isToggle) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.toggle();
    }
  }
}
