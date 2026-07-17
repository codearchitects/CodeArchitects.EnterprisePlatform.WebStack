import { TestBed, inject } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IJsonClaim, IJsonClaimProperty, IJsonPolicies, IJsonPolicyClaimRoot, IJsonPolicyOrRoot, IJsonPolicyAndRoot,
  IClaim, IPolicy, IJsonPolicyClaim, IPolicyCondition, IPolicyRuleOrNode, IPolicyRuleAndNode, IPolicyRuleLeaf, ClaimType, IJsonPolicyConditionNode, PolicyType
} from '@ca-webstack/policy-engine';
import { PolicyEngineService } from './policy-engine.service';

export function main() {
  describe('PolicyEngineService', () => {
    let sut: PolicyEngineService;

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [PolicyEngineService] });
    });

    beforeEach(inject([PolicyEngineService], (policyEngineService: PolicyEngineService) => {
      sut = policyEngineService;
    }));

    describe('Claims', () => {

      it('should set an empty claim array', () => {
        // Arrange
        const fixture = JsonClaimBuilder.start()
          .build();

        // Act
        sut.setJsonClaims(fixture);
        const actual: IClaim[] = sut.claims;
        const expected: IClaim[] = ClaimBuilder.start()
          .build();

        // Assert
        expect(actual).toEqual(expected);
      });

      it('should set a claim array', () => {
        // Arrange
        const claim1 = {
          type: ClaimType.emailAddress,
          value: 'jhon.doe@some-company.com'
        };
        const claim2 = {
          type: ClaimType.emailAddress,
          value: 'jane.doe@some-company.com'
        };

        const fixture = JsonClaimBuilder.start()
          .addClaims(claim1, claim2)
          .build();

        // Act
        sut.setJsonClaims(fixture);
        const actual: IClaim[] = sut.claims;
        const expected: IClaim[] = ClaimBuilder.start()
          .addClaims(claim1, claim2)
          .build();

        // Assert
        expect(actual).toEqual(expected);
      });

      it('should reset claims', () => {
        // Arrange
        const claim1 = {
          type: ClaimType.emailAddress,
          value: 'jhon.doe@some-company.com'
        };
        const claim2 = {
          type: ClaimType.emailAddress,
          value: 'jane.doe@some-company.com'
        };

        const fixture = JsonClaimBuilder.start()
          .addClaims(claim1, claim2)
          .build();

        sut.setJsonClaims(fixture);

        // Act
        sut.resetClaims();
        const actual: IClaim[] = sut.claims;
        const expected: IClaim[] = ClaimBuilder.start()
          .build();

        // Assert
        expect(actual).toEqual(expected);

      });

    });

    describe('Policies', () => {

      it('should set an empty policy array', () => {
        // Arrange
        const fixture = JsonPolicyBuilder.start()
          .build();

        // Act
        sut.setJsonPolicies(fixture.claimsAuthorizationPolicyManager.policy);
        const actual: IPolicy[] = sut.policies;
        const expected: IPolicy[] = PolicyBuilder.start()
          .build();

        // Assert
        expect(actual).toEqual(expected);
      });

      it('should set a policy array', () => {
        // Arrange
        const resource = 'command://application1/domain1/task1/command1';
        const resourceRegex = /^command:\/\/application1\/domain1\/task1\/command1$/;
        const selector = 'execute';
        const claim = {
          type: ClaimType.emailAddress,
          value: 'jhon.doe@some-company.com'
        };

        const fixture = JsonPolicyBuilder.start()
          .addPolicyClaimRoot(resource, selector, claim)
          .build();

        // Act
        sut.setJsonPolicies(fixture.claimsAuthorizationPolicyManager.policy);
        const actual: IPolicy[] = sut.policies;
        const expected: IPolicy[] = PolicyBuilder.start()
          .addPolicyRuleLeaf({ resourceRegex: resourceRegex, selector: selector, type: 'authorization', fixture: claim })
          .build();

        // Assert
        expect(actual).toEqual(expected);
      });

      it('should reset policies', () => {
        // Arrange
        const resource = 'command://application1/domain1/task1/command1';
        const selector = 'execute';
        const claim = {
          type: ClaimType.emailAddress,
          value: 'jhon.doe@some-company.com'
        };

        const fixture = JsonPolicyBuilder.start()
          .addPolicyClaimRoot(resource, selector, claim)
          .build();

        sut.setJsonPolicies(fixture.claimsAuthorizationPolicyManager.policy);

        // Act
        sut.resetPolicies();
        const actual: IPolicy[] = sut.policies;
        const expected: IPolicy[] = PolicyBuilder.start()
          .build();

        // Assert
        expect(actual).toEqual(expected);
      });

    });

    describe('Authorization manager', () => {

      const testFinish$ = new Subject<void>();

      function onError() { console.error('Subscription error.'); }
      function onComplete() { console.log('Subscription complete.'); }

      beforeEach(() => {
        const resource1 = 'command://app1/domain1/task1/command1';
        const resource2 = 'command://app1/domain1/task1/command2';
        const selector = 'execute';
        const claim1 = {
          type: ClaimType.emailAddress,
          value: 'jhon.doe@some-company.com'
        };
        const claim2 = {
          type: ClaimType.emailAddress,
          value: 'jane.doe@some-company.com'
        };

        const claimFixtures = JsonClaimBuilder.start()
          .addClaims(claim1)
          .build();

        const policyFixtures = JsonPolicyBuilder.start()
          .addPolicyClaimRoot(resource1, selector, claim1)
          .addPolicyClaimRoot(resource2, selector, claim2)
          .build();

        sut.setJsonClaims(claimFixtures);
        sut.setJsonPolicies(policyFixtures.claimsAuthorizationPolicyManager.policy);
      });

      afterEach(() => {
        testFinish$.next(null);
      });

      it('should check truthy authorization', () => {
        // Act
        const authorization = sut.observePolicies<IAuthorization>('command://app1/domain1/task1/command1', 'execute');

        authorization
          .pipe(takeUntil(testFinish$))
          .subscribe(onNext, onError, onComplete);

        // Assert
        function onNext(actual: IAuthorization) {
          const expected = { execute: true };
          expect(actual).toEqual(expected);
        }
      });

      it('should check falsy authorization', () => {
        // Act
        const authorization = sut.observePolicies<IAuthorization>('command://app1/domain1/task1/command2', 'execute');

        authorization
          .pipe(takeUntil(testFinish$))
          .subscribe(onNext, onError, onComplete);

        // Assert
        function onNext(actual: IAuthorization) {
          const expected = { execute: false };
          expect(actual).toEqual(expected);
        }
      });

      it('should check absent authorization', () => {
        // Act
        const authorization = sut.observePolicies<IAuthorization>('command://app1/domain1/task1/command3', 'execute');

        authorization
          .pipe(takeUntil(testFinish$))
          .subscribe(onNext, onError, onComplete);

        // Assert
        function onNext(actual: IAuthorization) {
          const expected = { execute: undefined };
          expect(actual).toEqual(expected);
        }
      });

      it('should check multiple authorization', () => {
        // Act
        const authorization = sut.observePolicies<IAuthorization>('command://app1/domain1/task1/command1', 'execute', 'visible');

        authorization
          .pipe(takeUntil(testFinish$))
          .subscribe(onNext, onError, onComplete);

        // Assert
        function onNext(actual: IAuthorization) {
          const expected = { execute: true, visible: undefined };
          expect(actual).toEqual(expected);
        }
      });

    });

  });
}

interface IFixtureClaim {
  type: string;
  value: string;
}

class JsonClaimBuilder {
  jsonClaims: IJsonClaim[] = [];

  static start() {
    return new JsonClaimBuilder();
  }

  addClaims(...fixtures: IFixtureClaim[]) {
    const jsonClaims = fixtures.map(this.getJsonClaim, this);
    this.jsonClaims.push(...jsonClaims);
    return this;
  }

  build() {
    return this.jsonClaims;
  }

  private getJsonClaim(fixture: IFixtureClaim): IJsonClaim {
    return {
      issuer: 'https://codearchitects.accesscontrol.windows.net/',
      originalIssuer: 'https://codearchitects.accesscontrol.windows.net/',
      properties: this.getJsonClaimProperty(),
      type: fixture.type,
      value: fixture.value,
      valueType: 'http://www.w3.org/2001/XMLSchema#string'
    };
  }

  private getJsonClaimProperty(): IJsonClaimProperty {
    return {};
  }
}

class ClaimBuilder {
  claims: IClaim[] = [];

  static start() {
    return new ClaimBuilder();
  }

  addClaims(...fixtures: IFixtureClaim[]) {
    const claims = fixtures.map(this.getJsonClaim);
    this.claims.push(...claims);
    return this;
  }

  build() {
    return this.claims;
  }

  private getJsonClaim(fixture: IFixtureClaim): IClaim {
    return {
      type: fixture.type,
      value: fixture.value
    };
  }
}

class JsonPolicyBuilder {
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

    this.lastPolicy = (<IPolicyRuleOrNode>policy.ruleTree).or;
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

    this.lastPolicy = (<IPolicyRuleAndNode>policy.ruleTree).and;
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


interface IAuthorization {
  [key: string]: boolean;
}

main();
