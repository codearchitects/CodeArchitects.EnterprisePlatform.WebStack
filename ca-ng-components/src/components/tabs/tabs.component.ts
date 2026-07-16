import { Component, ContentChild, ElementRef, EventEmitter, Injector, Input, OnInit, Output, QueryList, TemplateRef, ViewChildren } from '@angular/core';
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
   * References to the rendered tab header elements, used to move DOM focus
   * when navigating the tablist with the keyboard (roving tabindex).
   */
  @ViewChildren('tabHeader') /*protected*/ public tabHeaders: QueryList<ElementRef<HTMLElement>>;
  /**
   * Tab that currently owns keyboard focus. Tracked independently of the
   * selected tab so the roving tabindex always follows DOM focus, even when a
   * selection change is rejected by `onCanValueChanges` (APG roving tabindex).
   */
  private focusedTab: IShTab;
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

  /**
   * Stable DOM id for a tab header (APG `role="tab"` element).
   * Preserves any author-supplied `tab.id`, falling back to a unique
   * component-scoped id so aria-controls / aria-labelledby always resolve.
   * @param tab Tab
   * @param index Tab index in `model`
   */
  /*protected*/ public tabDomId(tab: IShTab, index: number): string {
    return tab?.id || `${this.id}-tab-${index}`;
  }

  /**
   * Stable DOM id of the single tab panel (APG `role="tabpanel"`).
   */
  public get panelId(): string {
    return `${this.id}-panel`;
  }

  /**
   * DOM id of the currently selected tab header, used as the panel's
   * accessible name via aria-labelledby.
   */
  public get currentTabDomId(): string | null {
    return this.current ? this.tabDomId(this.current, this.model.indexOf(this.current)) : null;
  }

  /**
   * DOM id of the one tab header that must be keyboard-reachable (tabindex 0)
   * per the APG roving-tabindex rule: the focused tab if any, else the selected
   * tab, else the first non-hidden/non-disabled tab. This guarantees the tablist
   * always has exactly one tab stop, even when no tab is current (e.g.
   * `autosetCurrentTab` is false or `onCanValueChanges` rejects the auto-select),
   * avoiding a keyboard trap where the whole tablist becomes unreachable.
   */
  public get focusableTabDomId(): string | null {
    const rendered = (tab: IShTab) => tab && !tab.isHidden;
    const tab = (rendered(this.focusedTab) && this.focusedTab)
      || (rendered(this.current) && this.current)
      || this.model?.find(t => !t.isHidden && !t.isDisabled)
      || this.model?.find(t => !t.isHidden);
    return tab ? this.tabDomId(tab, this.model.indexOf(tab)) : null;
  }

  /**
   * Keeps the roving-focusable tab in sync with the tab that actually owns DOM
   * focus (keyboard navigation, click or programmatic focus), so focus never
   * lands on a tab whose tabindex is -1.
   * @param tab Tab header that received focus
   */
  /*protected*/ public onTabHeaderFocus(tab: IShTab) {
    this.focusedTab = tab;
  }

  /**
   * Keyboard navigation for the tablist (WAI-ARIA APG tabs pattern).
   * Arrow keys move between tabs, Home/End jump to first/last; activation
   * follows focus (matching the existing click/Enter activation). Enter and
   * Space activate the focused tab. Hidden and disabled tabs are skipped.
   * @param event Keyboard event
   * @param tab Tab currently owning focus
   */
  /*protected*/ public onTabKeydown(event: KeyboardEvent, tab: IShTab) {
    const selectable = this.model.filter(t => !t.isHidden && !t.isDisabled);
    if (!selectable.length) { return; }
    const currentPos = Math.max(0, selectable.indexOf(tab));
    let nextPos = currentPos;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextPos = (currentPos + 1) % selectable.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextPos = (currentPos - 1 + selectable.length) % selectable.length;
        break;
      case 'Home':
        nextPos = 0;
        break;
      case 'End':
        nextPos = selectable.length - 1;
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        if (!tab.isDisabled) { this.select(tab); }
        return;
      default:
        return;
    }
    event.preventDefault();
    const nextTab = selectable[nextPos];
    // Track focus first so the roving tabindex follows DOM focus regardless of
    // whether the selection change below is accepted by onCanValueChanges.
    this.focusedTab = nextTab;
    this.select(nextTab);
    this.focusTab(nextTab);
  }

  /**
   * Moves DOM focus to a tab header element (roving tabindex support).
   * @param tab Tab to focus
   */
  private focusTab(tab: IShTab) {
    const domId = this.tabDomId(tab, this.model.indexOf(tab));
    this.tabHeaders?.find(ref => ref.nativeElement.id === domId)?.nativeElement.focus();
  }
}
