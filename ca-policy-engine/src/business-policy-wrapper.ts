import { IPolicy } from './core';
import { IJsonPolicy, PolicyWrapper, PolicyWrapperHelper } from './policy-wrapper';
import { IJsonBusinessRulePolicyInfo, IBusinessRulePolicyInfo, IJsonBusinessRulePolicy, IBusinessRulePolicy } from './business-policy';

console.log(new PolicyWrapper());
console.log(PolicyWrapperHelper);

export class BusinessPolicyWrapper extends PolicyWrapper {
  public wrapJsonPolicy(jsonPolicy: IJsonPolicy): IPolicy {
    return {
      resource: this.wrapJsonResource(jsonPolicy['resource']),
      selector: jsonPolicy['selector'],
      type: jsonPolicy['type'],
      policyInfo: this.wrapJsonBusinessRulePolicyInfo(jsonPolicy['policyInfo']),
      condition: this.wrapJsonPolicyNodes(jsonPolicy['condition']),
    };
  }

  public wrapJsonBusinessRulePolicyInfo(jsonData: IJsonBusinessRulePolicyInfo): IBusinessRulePolicyInfo | IBusinessRulePolicyInfo[] {
    if (Array.isArray(jsonData)) {
      const retval = [];
      jsonData.forEach(i => retval.push(i));
      return retval;
    } else {
      const expression: string | string[] = jsonData.expression;
      return {
        name: jsonData.name,
        expression: expression,
        type: jsonData.type
      };
    }
  }

  public wrapJsonBusinessRulePolicy(jsonData: IJsonBusinessRulePolicyInfo): IBusinessRulePolicyInfo {
    return {
      type: jsonData.type,
      expression: jsonData.expression
    };
  }
}
