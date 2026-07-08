import { PolicyWrapper } from './policy-wrapper';
import { PolicyEngine, Context } from './policy-engine';
import { IPolicy, IClaim } from './core';

export function RegisterAllHandlers() {
  PolicyEngine.RegisterHandler({
    type: 'authorization',
    handler: (policy: IPolicy, claims: IClaim[], context: Context) => {
      const retval = context.policyEngine.checkCondition(policy.condition, claims);
      return retval;
    },
    createWrapHandler: () => new PolicyWrapper()
  });
}
