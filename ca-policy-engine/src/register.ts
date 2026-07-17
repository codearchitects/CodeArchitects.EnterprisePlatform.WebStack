import { PolicyWrapper } from './policy-wrapper';
import { BusinessPolicyWrapper } from './business-policy-wrapper';
import { PolicyEngine, Context } from './policy-engine';
import { IPolicy, IClaim } from './core';
import { IBusinessRulePolicy, runBusinessPolicy } from './business-policy';

export function RegisterAllHandlers() {
  PolicyEngine.RegisterHandler({
    type: 'authorization',
    handler: (policy: IPolicy, claims: IClaim[], context: Context) => {
      const retval = context.policyEngine.checkCondition(policy.condition, claims);
      return retval;
    },
    createWrapHandler: () => new PolicyWrapper()
  });

  PolicyEngine.RegisterHandler({
    type: 'business',
    handler: (policy: IBusinessRulePolicy, claims: IClaim[], context: Context) => {
      const retval = runBusinessPolicy(policy, context);
      return retval;
    },
    createWrapHandler: () => new BusinessPolicyWrapper()
  });

  PolicyEngine.RegisterHandler({
    type: 'babel',
    handler: (policy: IBusinessRulePolicy, claims: IClaim[], context: Context) => {
      const retval = runBusinessPolicy(policy, context);
      return retval;
    },
    createWrapHandler: () => new BusinessPolicyWrapper()
  });
}
