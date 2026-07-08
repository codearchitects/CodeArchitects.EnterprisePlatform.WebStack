import { Component, ContentChild, EventEmitter, Injector, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

/**
 * Tab interface
 */
export interface IShTab {
  /**
   * Tab identifier
   */
  id?: string;
  /**
   * Tab title
   */
  title: string;
  /**
   * Specifies whether tab is currently active
   */
  isCurrent?: boolean;
  /**
   * Specifies whether tab is hidden
   */
  isHidden?: boolean;
  /**
   * Specifies whether tab is disabled
   */
  isDisabled?: boolean;
}

@Component({
    selector: 'sh-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Tabs component
 */
export class ShTabsComponent extends ShBaseAuthComponent<IShBaseOptions> implements OnInit {
  /**
   * List of tabs
   */
  @Input() public model: IShTab[] = [];
  /**
   * Specifies whether tabs must set the first tab as current
   * when there aren't current tabs
   */
  @Input() public autosetCurrentTab = true;
  /**
   * Specifies whether tabs are aligned to the left of its container
   */
  @Input() public isLeftAligned = false;
  /**
   * Specifies whether tabs bodies positions itself absolutely instead of relatively
   */
  @Input() public hasAbsoluteContent = false;
  /**
   * Event fired on tab change
   */
  @Output() public tabChange = new EventEmitter<IShTab>();
  /**
   * Tab content template
   */
  @ContentChild('content') /*protected*/ public template: TemplateRef<HTMLElement>;
  /**
   * Current tab
   */
  /*protected*/ public current: IShTab;
  /**
   * Tab content template context
   */
  /*protected*/ public templateContext: { $implicit: IShTab } = { $implicit: undefined };
  /**
   * Tabs component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (this.autosetCurrentTab) {
      this.select(this.model.find(tab => tab.isCurrent) || this.model[0]);
    }
  }

  /**
   * Make current a specific tab
   * @param tab Tab
   */
  /*protected*/ public select(tab: IShTab) {
    if (this.internalOptions.onCanValueChanges(this.current, tab)) {
      this.model.forEach(t => t.isCurrent = false);
      tab.isCurrent = true;
      this.current = tab;
      this.templateContext.$implicit = this.current;
      this.tabChange.emit(this.current);
    }
  }
}
