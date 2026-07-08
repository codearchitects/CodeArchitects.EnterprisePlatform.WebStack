import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { Activity, INavigateArgs, IStackFrame, ITaskSlot, RouteHelper } from '@ca-webstack/ng-shell';
import { UUID } from 'angular2-uuid';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaepSideMenuLinkKind, ICaepSideMenuEntry } from '../../models';
import { CaepSideMenuService } from '../../services';
import { CAEP_SIDE_MENU_STACK_FRAME_FACTORY, CAEP_SIDE_MENU_TASK_SLOT_FACTORY } from '../../tokens';

@Directive({
    selector: 'a[caepRouterLink]',
    standalone: false
})
export class CaepRouterLinkDirective implements OnChanges, OnInit, OnDestroy {
  //#region Internals
  private _destroy$ = new Subject<void>();
  private _currentLocation: string;
  //#endregion
  //#region Bindings
  @HostBinding('attr.href') href: string;
  //#endregion
  //#region Inputs
  @Input() caepRouterLink: ICaepSideMenuEntry;
  @Input() enable = true;
  //#endregion
  //#region Outputs
  @Output() inward = new EventEmitter<void>();
  //#endregion
  constructor(
    private _menuService: CaepSideMenuService,
    private _router: Router,
    @Inject(CAEP_SIDE_MENU_TASK_SLOT_FACTORY) private _taskSlot: () => ITaskSlot,
    @Inject(CAEP_SIDE_MENU_STACK_FRAME_FACTORY) private _stackFrame: () => IStackFrame
  ) {}
  //#region Lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.caepRouterLink) {
      this._updateHref();
    }
  }
  ngOnInit(): void {
    this._menuService.location$
      .pipe(takeUntil(this._destroy$))
      .subscribe(location => (this._currentLocation = location));
  }
  ngOnDestroy(): void {
    this._destroy$.next();
  }
  //#endregion
  //#region Listeners
  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.shiftKey', '$event.altKey', '$event.metaKey'])
  protected onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean) {
    if (!this.enable) return false; // check enabled
    if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) return true; // check it is a 'clean' click
    if (!this.caepRouterLink) return true; // check entry actually exists
    if (typeof this.caepRouterLink.link?.target === 'string' && this.caepRouterLink.link?.target != '_self')
      return true; // check it is same target click
    if (this.caepRouterLink.link?.kind === CaepSideMenuLinkKind.Link) return true; // check if it is an external link
    if (this.caepRouterLink.children?.length) {
      // route has children, so this is an expand request
      this.inward.emit();
      return false;
    }
    if (!this.caepRouterLink.link?.url) return true; // can not navigate without a url
    const mappedArgs = this._menuService.mapToNavigationArgs(this.caepRouterLink.link.url);
    const args: INavigateArgs = {
      application: mappedArgs.application,
      domain: mappedArgs.domain,
      scenario: mappedArgs.scenario,
      action: mappedArgs.action,
      queryParams: mappedArgs.queryParams
    };
    if (!args.application) {
      // no application, so we navigate to the root
      this._router.navigate([`/`]);
      return false;
    }
    if (!args.domain) {
      // no domain, so we navigate to the application
      this._router.navigate([`/${args.application}`]);
      return false;
    }
    if (!args.scenario) {
      // no scenario, so we navigate to the domain
      this._router.navigate([`/${args.application}/${args.domain}`]);
      return false;
    }
    const preserveNavigation = this._menuService.canPreserveNavigation(this._currentLocation, this.caepRouterLink);
    if (preserveNavigation) {
      // during preserve navigation we need to keep the current activity and delegates
      args.activity = mappedArgs.activity;
      args.delegates = mappedArgs.delegates;
    }
    if (args.scenario) {
      if (preserveNavigation && Activity.CurrentTaskId) {
        // during preserve navigation we need to keep the current task id
        args.scenario = [args.scenario, Activity.CurrentTaskId];
      }
      if (!args.action) {
        // TODO: When no action is given, we must set it to start since route helper needs it, this should be removed since ngmodule should decide their default routes
        args.action = 'start';
      } else if (args.action !== 'start' && args.action[0] !== 'start') {
        // When action is given and is not start, we should navigate through start whenever current state is not the start one
        // and we are navigating towards same scenario or preserve navigation is disabled
        // This way we won't go through start when preserve navigation is enabled and we are within the same scenario
        const oldArgs = this._menuService.mapToNavigationArgs(this._currentLocation);
        const isSameScenario = this._compareSegments(
          oldArgs.scenario,
          args?.scenario?.length > 0 ? args.scenario?.[0] : args.scenario
        );
        if (
          (!isSameScenario || (oldArgs.action !== 'start' && oldArgs.action[0] !== 'start')) &&
          (!preserveNavigation ||
            !this._compareSegments(oldArgs.application, args.application) ||
            !this._compareSegments(oldArgs.domain, args.domain) ||
            !isSameScenario)
        ) {
          args.action = ['start', ...(Array.isArray(args.action) ? args.action : [args.action])];
        }
      }
    }
    if (!args.delegates) {
      // TODO: Workaround for route helper which needs delegates for creating a unique identifier
      args.delegates = { getUniqueIdentifier: () => of(UUID.UUID()) } as any;
    }

    // navigate
    RouteHelper.navigate(this._router, args, this._taskSlot, this._stackFrame);

    return false;
  }
  //#endregion
  //#region Internal hooks
  /**
   * Updates the href property based on the caepRouterLink input.
   * If caepRouterLink.link.url is not defined, sets href to null.
   * If caepRouterLink.link.kind is Link, sets href to caepRouterLink.link.url or maps it using _menuService.mapToUrl.
   * If caepRouterLink.link.kind is not Link, maps caepRouterLink.link.url to navigation args using _menuService.mapToNavigationArgs,
   * maps the args to a URL using _menuService.mapToUrl, and sets href to the resulting URL.
   */
  private _updateHref() {
    if (!this.caepRouterLink?.link?.url) {
      this.href = null;
    } else {
      const isLink = this.caepRouterLink.link.kind === CaepSideMenuLinkKind.Link;
      if (isLink) {
        this.href =
          typeof this.caepRouterLink.link.url === 'string'
            ? this.caepRouterLink.link.url
            : this._menuService.mapToUrl(this.caepRouterLink.link.url);
      } else {
        const args =
          typeof this.caepRouterLink.link.url === 'string'
            ? this._menuService.mapToNavigationArgs(this.caepRouterLink.link.url, false)
            : this.caepRouterLink.link.url;
        const url = this._menuService.mapToUrl(args, { addStart: true, addTaskId: true });
        this.href = `#${url.startsWith('/') ? '' : '/'}${url}`;
      }
    }
  }
  /**
   * Compares two navigation args segments.
   */
  private _compareSegments(left: string | string[], right: string | string[]) {
    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) return false;
      for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index]) return false;
      }
      return true;
    }
    if (typeof left === 'string' && typeof right === 'string') return left === right;
    return false; // Types do not match
  }
  //#endregion
}
