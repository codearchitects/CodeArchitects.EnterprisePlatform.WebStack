import { Injectable } from '@angular/core';
import { PolicyEngine, IClaim, IPolicy, IJsonClaim, ClaimWrapper, IJsonPolicies, PolicyWrapperHelper, IJsonPolicy } from '@ca-webstack/policy-engine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyEngineService {
  private _policyEngine = new PolicyEngine();

  get claims(): IClaim[] { return this._policyEngine.claims; }
  get policies(): IPolicy[] { return this._policyEngine.policies; }
  get context() { return this._policyEngine.context; }
  set context(value: any) { this._policyEngine = new PolicyEngine(value); }
  get data() { return this._policyEngine.data; }
  get isCacheEnabled() {
    return PolicyEngine.EnableCaching;
  }
  set isCacheEnabled(value: boolean) {
    PolicyEngine.EnableCaching = value;
  }

  constructor() {
    this.isCacheEnabled = false;
  }

  setClaims(claims: IClaim[]) {
    this._policyEngine.claims = claims;
  }

  resetClaims() {
    this._policyEngine.claims = [];
  }

  setPolicies(policies: IPolicy[]) {
    this._policyEngine.policies = policies;
  }

  setJsonPolicies(policies: IJsonPolicy[]) {
    const jsonPolicies: IJsonPolicies = { claimsAuthorizationPolicyManager: { policy: policies } };
    this._policyEngine.policies = PolicyWrapperHelper.wrapJsonPolicies(jsonPolicies);
  }

  setJsonClaims(jsonClaims: IJsonClaim[]) {
    this._policyEngine.claims = ClaimWrapper.wrapJsonClaims(jsonClaims);
  }

  resetPolicies() {
    this._policyEngine.policies = [];
  }

  observePolicies<T>(resource: string, ...selectors: string[]): Observable<T> {
    return this._policyEngine.observePolicies<T>(resource, ...selectors);
  }

  runPolicies<T>(resource: string, ...selectors: string[]) {
    return this._policyEngine.runPolicies<T>(resource, ...selectors);
  }

  runPoliciesWithContext<T>(context: any, resource: string, ...selectors: string[]) {
    return this._policyEngine.runPoliciesWithContext<T>(context, resource, ...selectors);
  }

}
