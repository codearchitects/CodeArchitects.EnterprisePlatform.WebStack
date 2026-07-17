import { expect, use } from 'chai';
import { PolicyEngine } from '@ca-webstack/policy-engine';

describe('ca-policy-engine should', () => {

  it('expose a policy engine', () => {
    const obj = new PolicyEngine();
    expect(obj).to.exist;
  });

});
