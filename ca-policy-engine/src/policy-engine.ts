import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinct } from 'rxjs/operators';
import { IClaim, IPolicyCondition, IPolicyRuleLeaf, IPolicyRuleOrNode, IPolicyRuleAndNode, Utility, IPolicy, IPolicyHandler } from './core';

export type Context = { policyEngine: PolicyEngine, data?: any, [key: string]: any };

export class PolicyEngine {

  private static _policyHandlers: { [key: string]: IPolicyHandler } = {};

  public static EnableCaching = true;
  private static _resourcePoliciesBySelectorCache = {};
  private static _resourcePoliciesByResourceCache = {};
  private _claims: IClaim[] = [];
  private _policies: IPolicy[] = [];

  private claims$ = new BehaviorSubject<IClaim[]>(this._claims);
  private policies$ = new BehaviorSubject<IPolicy[]>(this._policies);
  private args: Context;

  private rules$ = combineLatest(this.claims$, this.policies$);

  constructor(args?: any) {
    this.args = args || { context: {} };
    this.args.context.policyEngine = this;
  }

  public static GetPolicyHandler(type: string): IPolicyHandler {
    return this._policyHandlers[type];
  }

  public static RegisterHandler(handler: IPolicyHandler) {
    PolicyEngine._policyHandlers[handler.type] = handler;
  }

  public static UnregisterHandler(handler: IPolicyHandler) {
    delete PolicyEngine._policyHandlers[handler.type];
  }

  get context() { return this.args.context; }
  get data() { return this.args.data; }

  get claims() { return [...this._claims]; }
  set claims(value: IClaim[]) { this._claims = value || []; this.claims$.next(this._claims); }

  get policies() { return [...this._policies]; }
  set policies(value: IPolicy[]) {
    PolicyEngine._resourcePoliciesBySelectorCache = {};
    PolicyEngine._resourcePoliciesByResourceCache = {};
    this._policies = value || [];
    this.policies$.next(value);
  }

  observePolicies<T>(resource: string, ...selectors: string[]) {
    return this.rules$
      .pipe(map(([claims, policies]) => this.runPolicyHandler<T>(resource, selectors, claims as any, policies as any), distinct()));
  }

  runPoliciesWithContext<T>(context: any, resource: string, ...selectors: string[]) {
    const result = {};
    this.rules$
      .forEach(([claims, policies]) => {
        const resourcePolicies = (PolicyEngine.EnableCaching && PolicyEngine._resourcePoliciesByResourceCache[resource])
          || (PolicyEngine._resourcePoliciesByResourceCache[resource] = (policies as any).filter(policy => (policy.resource.test(resource) && this.checkCondition(policy.condition, claims))));
        resourcePolicies.forEach(policy => {
            const handler = PolicyEngine.GetPolicyHandler(policy.type);
            if (handler != null) {
              const temp = handler.handler(policy, claims as any, context);
              for (const i in temp) {
                if (i) result[i] = temp[i];
              }
            } else {
              throw new Error(`unsupported policy type: ${policy.type}`);
            }
        });
      });
    return result;
  }

  runPolicies<T>(resource: string, ...selectors: string[]) {
    return this.runPoliciesWithContext(this.context, resource, ...selectors);
  }

  private runPolicyHandler<T>(resource: string, selectors: string[], claims: IClaim[], policies: IPolicy[]) {
    const resourcePolicies = (PolicyEngine.EnableCaching && PolicyEngine._resourcePoliciesByResourceCache[resource])
      || (PolicyEngine._resourcePoliciesByResourceCache[resource] = policies.filter((policy) => policy.resource.test(resource)));

    return selectors
      .reduce((accumulator, selector) => {
        accumulator[selector] = this.runPolicy(selector, claims, resourcePolicies);
        return accumulator;
      }, <T>{});
  }

  private runPolicy(selector: string, claims: IClaim[], resourcePolicies: IPolicy[]) {
    let retval;
    const policyEngineBackPointer = this;
    // filter out only policies with given selector
    const selectedPolicies: IPolicy[] = (PolicyEngine.EnableCaching && PolicyEngine._resourcePoliciesBySelectorCache[selector])
      || (PolicyEngine._resourcePoliciesBySelectorCache[selector] = resourcePolicies.filter(policy => policy.selector === selector));

    // TODO: =DG= forse la some non è corretta:
    const result = selectedPolicies.length > 0 ? selectedPolicies.forEach((policy: IPolicy) => {
      retval = retval || false;
      if (this.checkCondition(policy.condition, claims)) {
        const handler = PolicyEngine.GetPolicyHandler(policy.type);
        if (handler != null) {
          retval = retval || handler.handler.apply(policyEngineBackPointer, [policy, claims, this.context]);
        } else {
          throw new Error(`unsupported policy type: ${policy.type}`);
        }
      }
    }) : undefined;

    return retval;
  }

  public checkCondition(condition: IPolicyCondition, claims: IClaim[]) {
    let result = false;
    if (Utility.isLeafNode(condition)) {
      result = this.checkRuleLeaf(condition, claims);
    } else if (Utility.isOrNode(condition)) {
      result = this.checkRuleOrNode(condition, claims);
    } else if (Utility.isAndNode(condition)) {
      result = this.checkRuleAndNode(condition, claims);
    }
    return result;
  }

  private checkRuleLeaf(condition: IPolicyRuleLeaf, claims: IClaim[]) {
    return claims.some((claim) => {
      return condition.claimType === claim.type && condition.claimValue === claim.value;
    });
  }

  private checkRuleOrNode(condition: IPolicyRuleOrNode, claims: IClaim[]) {
    return condition.or.some((condition) => this.checkCondition(condition, claims));
  }

  private checkRuleAndNode(condition: IPolicyRuleAndNode, claims: IClaim[]) {
    return condition.and.every((condition) => this.checkCondition(condition, claims));
  }
}
