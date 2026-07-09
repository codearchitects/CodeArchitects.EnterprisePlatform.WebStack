import { Directive, EventEmitter, Injector, Input, SimpleChanges } from '@angular/core';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { distinct, takeUntil } from 'rxjs/operators';
import { CaepCoerceBoolean, CaepHook, CaepHookType } from '../../decorators';
import { PickAll, isNoU } from '../../utilities/common.utility';
import { CaepBaseComponent, CaepBaseOptions } from './base.component';

/**
 * Authorization actions contract
 */
export interface ICaepAuthorizationActions {
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
export abstract class CaepBaseAuthComponent<
  TOptions extends CaepBaseOptions = CaepBaseOptions,
  TPolicies = ICaepAuthorizationActions
> extends CaepBaseComponent<TOptions> {
  /**
   * Specifies if the control is enabled
   * @default true
   */
  @Input()
  @CaepCoerceBoolean()
  public enable: any = true;

  /**
   * Specifies if the control is visible
   * @default true
   */
  @Input()
  @CaepCoerceBoolean()
  public show: any = true;

  /**
   * Resource linked to control
   */
  @Input() public resource?: string;

  /**
   * Policies selectors
   */
  @Input() public selectors: string[] = ['enable', 'show'];

  /**
   * Authorization service
   */
  public policyEngineService: PolicyEngineService;

  /**
   * Resource service
   */
  public resourceService: ResourceService;

  /**
   * Authorization actions
   */
  public authorizations: ICaepAuthorizationActions = {
    enable: true,
    show: true
  };

  /**
   * Event fired when enable property changes
   */
  protected enableEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Last merged enable value
   */
  private _lastMergedEnable = this.enable;

  /**
   * Last merged show value
   */
  private _lastMergedShow = this.show;

  /**
   * Base Component with actions and authentication service
   */
  constructor(
    injector: Injector,
    optionsCtor: (value?: PickAll<TOptions>) => TOptions = (value?: PickAll<TOptions>) =>
      new CaepBaseOptions(value) as TOptions
  ) {
    super(injector, optionsCtor);
    this.policyEngineService = injector.get(PolicyEngineService);
    this.resourceService = injector.get(ResourceService);
  }

  /**
   * Event fired when new policies roll in.
   * Subclass which allow policies roll in, must override this method
   */
  public onPoliciesChanges(policies: TPolicies | ICaepAuthorizationActions) {
    const authorizations = policies as ICaepAuthorizationActions;
    if (authorizations) {
      this.authorizations.enable = isNoU(authorizations.enable) ? true : authorizations.enable;
      this.authorizations.show = isNoU(authorizations.show) ? true : authorizations.show;
      this.mergeActions();
      this.emitEnableChange();
      this.setControlRefUpdate();
      this._lastMergedEnable = this.enable;
      this._lastMergedShow = this.show;
    }
  }

  /**
   * Merges user actions with authorization actions
   */
  private mergeActions() {
    this.enable = this.enable && this.authorizations.enable;
    this.show = this.show && this.authorizations.show;
  }

  /**
   * Emits enable change event if current enable differs from last merged enable
   */
  private emitEnableChange() {
    if (this.enable !== this._lastMergedEnable) this.enableEmitter.emit(this.enable);
  }

  /**
   * Sets controlRefUpdate property to true if control becomes visible again
   */
  private setControlRefUpdate() {
    if (this.show !== this._lastMergedShow && this.show) this.controlRefUpdate = true;
  }

  /**
   * Subscribes to policies changes from policyEngineService
   */
  @CaepHook({ type: CaepHookType.Init })
  private observePolicies() {
    this.policyEngineService
      .observePolicies<TPolicies>(this.resource, ...this.selectors)
      .pipe(takeUntil(this.destroy$), distinct())
      .subscribe(this.onPoliciesChanges.bind(this));
  }

  /**
   * Merge actions on input action changes
   * @param changes SimpleChanges object containing input action changes
   */
  @CaepHook({ type: CaepHookType.Change })
  private onAuthorizationActionChange(changes: SimpleChanges) {
    if (changes['enable'] || changes['show']) {
      this.mergeActions();
      if (
        changes['show'] &&
        !changes['show'].firstChange /*&& !this.isChangeEqual(changes['show']) && changes['show'].currentValue*/
      ) {
        this.setControlRefUpdate();
      }
      if (changes['enable'] && !changes['enable'].firstChange /*&& !this.isChangeEqual(changes['enable'])*/) {
        //this.enableEmitter.emit(changes['enable'].currentValue);
        this.emitEnableChange();
      }
      this._lastMergedEnable = this.enable;
      this._lastMergedShow = this.show;
    }
  }
}
