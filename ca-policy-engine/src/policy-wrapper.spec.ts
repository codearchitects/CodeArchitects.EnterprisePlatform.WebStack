import { expect } from 'chai';

import { PolicyWrapper, IJsonPolicies, IJsonPolicyClaimRoot, IJsonPolicyOrRoot, IJsonPolicyAndRoot, IJsonPolicyClaim, IJsonPolicyConditionNode, PolicyWrapperHelper } from './policy-wrapper';
import { IPolicyCondition, IPolicyRuleLeaf, IPolicyRuleOrNode, IPolicyRuleAndNode, IPolicy, PolicyType } from './core';
import { ClaimType } from './claim-type';

import { RegisterAllHandlers } from './register';

describe('PolicyWrapper', () => {

  beforeEach(() => {
    RegisterAllHandlers();
  });

  it('should exists', () => {
    // Assert
    expect(PolicyWrapper).to.exist;
  });

  it('should wrap empty policy', () => {
    // Arrange
    const fixture = JsonPolicyBuilder.start()
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap claim root policy', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command1';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
    const selector = 'execute';

    const claim = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyClaimRoot(resource, selector, claim)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);

    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleLeaf({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixture: claim })
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap policy with "?" windcard in resource name', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command?';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command.$/;
    const selector = 'execute';
    const claim = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyClaimRoot(resource, selector, claim)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleLeaf({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixture: claim })
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap policy with "*" windcard in resource name', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/*';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/.*$/;
    const selector = 'execute';
    const claim = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyClaimRoot(resource, selector, claim)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleLeaf({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixture: claim })
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap "or" root policy', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command1';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
    const selector = 'execute';
    const claim1 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };
    const claim2 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jane.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyOrRoot(resource, selector, claim1, claim2)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleOrNode({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixtures: [claim1, claim2] })
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap "and" root policy', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command1';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
    const selector = 'execute';
    const claim1 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };
    const claim2 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jane.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyAndRoot(resource, selector, claim1, claim2)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleAndNode({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixtures: [claim1, claim2] })
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap "or" child policy', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command1';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
    const selector = 'execute';
    const claim1 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };
    const claim2 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jane.doe@some-company.com'
    };
    const claim3 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'bill.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyAndRoot(resource, selector, claim1)
      .appendPolicyOrNode(claim2, claim3)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleAndNode({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixtures: [claim1] })
      .appendPolicyRuleOrNode(claim2, claim3)
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap "and" child policy', () => {
    // Arrange
    const resource = 'command://application1/domain1/task1/command1';
    const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
    const selector = 'execute';
    const claim1 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jhon.doe@some-company.com'
    };
    const claim2 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'jane.doe@some-company.com'
    };
    const claim3 = {
      ['type']: ClaimType.emailAddress,
      ['value']: 'bill.doe@some-company.com'
    };

    const fixture = JsonPolicyBuilder.start()
      .addPolicyOrRoot(resource, selector, claim1)
      .appendPolicyAndNode(claim2, claim3)
      .build();

    // Act
    const actual: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);
    const expected: IPolicy[] = PolicyBuilder.start()
      .addPolicyRuleOrNode({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixtures: [claim1] })
      .appendPolicyRuleAndNode(claim2, claim3)
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });
});

interface IFixtureClaim {
  ['type']: string;
  ['value']: string;
}

export class JsonPolicyBuilder {
  jsonPolicies: IJsonPolicies = {
    claimsAuthorizationPolicyManager: {
      policy: []
    }
  };

  private lastPolicy: IJsonPolicyConditionNode;

  static start() {
    return new JsonPolicyBuilder();
  }

  addPolicyClaimRoot(resource: string, selector: string, fixture: IFixtureClaim) {
    const claimRoot: IJsonPolicyClaimRoot = {
      'resource': resource,
      'selector': selector,
      'type': 'authorization',
      'claim': this.getJsonClaim(fixture)
    };

    this.jsonPolicies.claimsAuthorizationPolicyManager.policy.push(claimRoot);
    return this;
  }

  addPolicyOrRoot(resource: string, selector: string, ...fixtures: IFixtureClaim[]) {
    const orRoot: IJsonPolicyOrRoot = {
      'resource': resource,
      'selector': selector,
      'type': 'authorization',
      'or': this.getJsonPolicyNode(...fixtures)
    };

    this.lastPolicy = orRoot['or'];
    this.jsonPolicies.claimsAuthorizationPolicyManager.policy.push(orRoot);
    return this;
  }

  addPolicyAndRoot(resource: string, selector: string, ...fixtures: IFixtureClaim[]) {
    const andRoot: IJsonPolicyAndRoot = {
      'resource': resource,
      'selector': selector,
      'type': 'authorization',
      'and': this.getJsonPolicyNode(...fixtures)
    };

    this.lastPolicy = andRoot['and'];
    this.jsonPolicies.claimsAuthorizationPolicyManager.policy.push(andRoot);
    return this;
  }

  appendPolicyOrNode(...fixtures: IFixtureClaim[]) {
    this.lastPolicy['or'] = this.getJsonPolicyNode(...fixtures);
    return this;
  }

  appendPolicyAndNode(...fixtures: IFixtureClaim[]) {
    this.lastPolicy['and'] = this.getJsonPolicyNode(...fixtures);
    return this;
  }

  build() {
    return this.jsonPolicies;
  }

  private getJsonClaim(fixture: IFixtureClaim): IJsonPolicyClaim {
    return {
      'claimType': fixture['type'],
      'claimValue': fixture['value']
    };
  }

  private getJsonPolicyNode(...fixtures: IFixtureClaim[]): IJsonPolicyConditionNode {
    return {
      ['claim']: fixtures.length === 1 ? this.getJsonClaim(fixtures[0]) : fixtures.map(this.getJsonClaim)
    };
  }
}

export class PolicyBuilder {
  policies: IPolicy[] = [];

  private lastPolicy: IPolicyCondition[];

  static start() {
    return new PolicyBuilder();
  }

  addPolicyRuleLeaf(options: { resourceRegex: RegExp, selector?: string, type: PolicyType, fixture: IFixtureClaim }) {
    const policy: IPolicy = {
      resource: options.resourceRegex,
      selector: options.selector,
      type: options.type,
      condition: this.getRuleLeaf(options.fixture)
    };

    this.policies.push(policy);
    return this;
  }

  addPolicyRuleOrNode(options: { resourceRegex: RegExp, selector?: string, type: PolicyType, fixtures: IFixtureClaim[] }) {
    const policy: IPolicy = {
      resource: options.resourceRegex,
      selector: options.selector,
      type: options.type,
      condition: this.getRuleOrNode(...options.fixtures)
    };

    this.lastPolicy = (<IPolicyRuleOrNode>policy.condition).or;
    this.policies.push(policy);
    return this;
  }

  addPolicyRuleAndNode(options: { resourceRegex: RegExp, selector?: string, type: string, fixtures: IFixtureClaim[] }) {
    const policy: IPolicy = {
      resource: options.resourceRegex,
      selector: options.selector,
      type: options.type,
      condition: this.getRuleAndNode(...options.fixtures)
    };

    this.lastPolicy = (<IPolicyRuleAndNode>policy.condition).and;
    this.policies.push(policy);
    return this;
  }

  appendPolicyRuleOrNode(...fixtures: IFixtureClaim[]) {
    this.lastPolicy.push(this.getRuleOrNode(...fixtures));
    return this;
  }

  appendPolicyRuleAndNode(...fixtures: IFixtureClaim[]) {
    this.lastPolicy.push(this.getRuleAndNode(...fixtures));
    return this;
  }

  build() {
    return this.policies;
  }

  private getRuleLeaf(fixture: IFixtureClaim): IPolicyRuleLeaf {
    return {
      claimType: fixture['type'],
      claimValue: fixture['value']
    };
  }

  private getRuleOrNode(...fixtures: IFixtureClaim[]): IPolicyRuleOrNode {
    return {
      or: fixtures.map(this.getRuleLeaf)
    };
  }

  private getRuleAndNode(...fixtures: IFixtureClaim[]): IPolicyRuleAndNode {
    return {
      and: fixtures.map(this.getRuleLeaf)
    };
  }
}
