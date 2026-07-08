import { OnInit, OnChanges, Injector, SimpleChanges, Input, Directive } from '@angular/core';
import * as _ from 'lodash-es';
import { IShBaseOptions, ShBaseComponent } from './base.component';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { takeUntil } from 'rxjs/operators';
import { distinct } from 'rxjs/operators';
import { isNoU } from '../../utilities/common.utility';

/**
 * Authorization actions contract
 */
export interface IShAuthorizationActions {
  /**
   * Specifies if the control is enabled
   * @default true
   */
  enable: boolean;
  /**
   * Specifies if the control is visible
   * @default true
   */
  show: boolean;
}

/**
 * Base Component with actions and authentication service
 */
@Directive()
export class ShBaseAuthComponent<TOptions extends IShBaseOptions, TPolicies = IShAuthorizationActions>
  extends ShBaseComponent<TOptions>
  implements OnChanges, OnInit {
  /**
   * Specifies if the control is enabled
   * @default true
   */
  @Input() public enable = true;
  /**
   * Specifies if the control is visible
   * @default true
   */
  @Input() public show = true;
  /**
   * Resource linked to control
   */
  @Input() public resource: string;
  /**
   * Policies selectors
   */
  @Input() public selectors: string[] = ['enable', 'show'];
  /**
   * Authorization service
   */
  /*protected*/ public policyEngineService: PolicyEngineService;
  /**
   * Resource service
   */
  /*protected*/ public resourceService: ResourceService;
  /**
   * Authorization actions
   */
  /*protected*/ public authorizations: IShAuthorizationActions = {
    enable: true,
    show: true
  };

  /**
   * Base Component with actions and authentication service
   */
  constructor(injector: Injector) {
    super(injector);
    this.policyEngineService = injector.get(PolicyEngineService);
    this.resourceService = injector.get(ResourceService);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['enable'] || changes['show']) {
      this.mergeActions();
    }
  }

  public ngOnInit() {
    super.ngOnInit();
    this.policyEngineService.observePolicies<TPolicies>(this.resource, ...this.selectors)
      .pipe(takeUntil(this.destroy$), distinct())
      .subscribe(this.onPoliciesChanges.bind(this));
  }

  /**
   * Event fired when new policies roll in.
   * Subclass which allow policies roll in, must override this method
   */
  /*protected*/ public onPoliciesChanges(policies: TPolicies | IShAuthorizationActions) {
    const authorizations = policies as IShAuthorizationActions;
    if (authorizations) {
      this.authorizations.enable = isNoU(authorizations.enable) ? true : authorizations.enable;
      this.authorizations.show = isNoU(authorizations.show) ? true : authorizations.show;
      this.mergeActions();
    }
  }

  /**
   * Merges user actions with authorization actions
   */
  private mergeActions() {
    this.enable = this.enable && this.authorizations.enable;
    this.show = this.show && this.authorizations.show;
  }

}
