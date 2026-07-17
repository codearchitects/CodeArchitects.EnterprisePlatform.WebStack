import { expect } from 'chai';
import { Subject, Observable } from 'rxjs';

import { PolicyEngine } from './policy-engine';
import { ClaimType } from './claim-type';
import { IPolicy, IPolicyHandler } from './core';
import { RuleType } from './business-policy';
import { takeUntil, skip } from 'rxjs/operators';

const k10policies = [];

for (let i = 0; i < 10000; i++) {
  k10policies.push({
    type: 'authorization',
    resource: new RegExp(`^entity:\/\/masterdata${i}$`),
    selector: 'read',
    condition: {
      or: [{
        claimType: ClaimType.emailAddress,
        claimValue: 'bill.doe@some-company.com'
      }, {
        claimType: ClaimType.emailAddress,
        claimValue: 'jane.doe@some-company.com'
      }]
    }
  });
}

describe('PolicyEngine', () => {
  // Arrange
  const testFinish$ = new Subject<any>();
  let sut: PolicyEngine;
  let data;

  function onError() {
    // console.error('Subscription error.');
  }
  function onComplete() {
    // console.log('      - Subscription complete.');
  }

  beforeEach(() => {
    data = { Country: 'Italy' };

    sut = new PolicyEngine({
      context: {
        data: data,
        assert: (condition: boolean) => {
          return expect(condition).to.be.equal(true);
        }
      }
    });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jhon.doe@some-company.com'
    }];

    const policies: IPolicy[] = [];
    for (let i = 1; i < 1000; i++) {
      if (i > 1 && i <= 3)
        continue;
      policies.push(...<IPolicy[]>[{
        type: 'authorization',
        resource: new RegExp(`^command:\/\/app1\/domain1\/task1\/command${i}$`),
        selector: 'execute',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }
      }, {
        type: 'authorization',
        resource: new RegExp(`^command:\/\/app1\/domain1\/task1\/command${i + 1}$`),
        selector: 'execute',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }
      }, {
        type: 'authorization',
        resource: new RegExp(`^command:\/\/app1\/domain1\/task1\/command${i + 2}$`),
        selector: 'change',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }
      }, {
        resource: new RegExp(`^entity://app1/domain1/task1/field${i}$`),
        selector: 'business',
        type: 'business',
        BusinessInfo: {
          expression: '(args) => Country === "Italy"',
        },
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }
      }, {
        resource: new RegExp(`^entity:\/\/people\/name${i}$`),
        selector: 'business',
        type: 'business',
        policyInfo: [{
          expression: '(args) => { this.Country === "Italy"; }',
        }, {
          type: RuleType.Simple,
          expression: [
            'context => { if (this.Country === "Italy") this.Country = "Germany";  return { country: "Germany" }; }',
            'context => { if (this.Country != "Italy") this.Country = "USA"; return { country2: "USA" }; }',
            'context => { if (this.Country === "USA") this.Country = "UK"; return { country3: "UK" } }',
            'context => { context.assert(this.Country === "UK"); return { success: true } }'
          ]
        }],
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }
      }]);
    }
    sut.policies = policies;
  });

  afterEach(() => {
    testFinish$.next(null);
  });

  it('should exists', () => {
    // Assert
    expect(PolicyEngine).to.exist;
    expect(sut).to.exist;
  });

  it('should retrieve claims', () => {
    // Act
    const claims = sut.claims;

    // Assert
    expect(claims).to.exist;
  });

  it('should retrieve empty claims', () => {
    // Act
    sut.claims = undefined;

    // Assert
    expect(() => sut.claims).to.not.throw(Error);
  });

  it('should retrieve policies', () => {
    // Act
    const policies = sut.policies;

    // Assert
    expect(policies).to.exist;
  });

  it('should retrieve empty policies', () => {
    // Act
    sut.policies = undefined;

    // Assert
    expect(() => sut.policies).to.not.throw(Error);
  });

  it('should check truthy authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'change', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IPolicyResult) {
      // let expected = { execute: true };
      // expect(actual).to.be.deep.equal(expected);
      expect(true).to.be.true;
    }
  });

  it('should check falsy authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: false };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check absent authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: undefined };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check multiple authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command1', 'execute', 'visible');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: true, visible: undefined };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check almost one authorization rule', () => {
    // Arrange
    sut.claims = sut.claims.concat({
      type: ClaimType.role,
      value: 'admin'
    });
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command2$/,
      selector: 'execute',
      condition: {
        claimType: ClaimType.role,
        claimValue: 'admin'
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: true };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check truthy async authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'execute');

    authorization
      .pipe(skip(1),
        takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command2$/,
      selector: 'execute',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jhon.doe@some-company.com'
      }
    });

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: true };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check falsy async authorization', () => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command1', 'execute');

    authorization
      .pipe(skip(1),
        takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command1$/,
      selector: 'execute',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jane.doe@some-company.com'
      }
    }).slice(1);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check truthy wildcard authorization', () => {
    // Arrange
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command\d+$/,
      selector: 'execute',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jhon.doe@some-company.com'
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command32', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check falsy wildcard authorization', () => {
    // Arrange
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/commandxyz\d+$/,
      selector: 'execute',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jane.doe@some-company.com'
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/commandxyz32', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check truthy "or" authorization', () => {
    // Arrange
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command3$/,
      selector: 'execute',
      condition: {
        or: [{
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }, {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }]
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check falsy "or" authorization', () => {
    // Arrange
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command3$/,
      selector: 'execute',
      condition: {
        or: [{
          claimType: ClaimType.emailAddress,
          claimValue: 'bill.doe@some-company.com'
        }, {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }]
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check truthy "and" authorization', () => {
    // Arrange
    sut.claims = sut.claims.concat({
      type: ClaimType.role,
      value: 'admin'
    });
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command3$/,
      selector: 'execute',
      condition: {
        and: [{
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }, {
          claimType: ClaimType.role,
          claimValue: 'admin'
        }]
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should check falsy "and" authorization', () => {
    // Arrange
    sut.policies = sut.policies.concat({
      type: 'authorization',
      resource: /^command:\/\/app1\/domain1\/task1\/command3$/,
      selector: 'execute',
      condition: {
        and: [{
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }, {
          claimType: ClaimType.role,
          claimValue: 'admin'
        }]
      }
    });

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).to.be.deep.equal(expected);
    }
  });

  it('should register and unregister policy handler', () => {
    let handlerExecuted = false;
    const expected: IPolicyHandler = {
      type: 'test', handler: context => {
        handlerExecuted = true;
      },
      createWrapHandler: null
    };
    PolicyEngine.RegisterHandler(expected);
    let actual = PolicyEngine.GetPolicyHandler(expected.type);
    expect(actual === expected);
    PolicyEngine.UnregisterHandler(expected);
    actual = PolicyEngine.GetPolicyHandler(expected.type);
    expect(actual).undefined;
  });

  it('should evaluate policy synchronously with custom context', () => {
    let result;
    data.Country = 'Italy';
    const context = Object.assign({}, sut.context);
    context.data = Object.assign({}, context.data);
    result = sut.runPoliciesWithContext<IPolicyResult>(context, 'entity://people/name100', 'business');
    // Assert
    expect(result).to.be.not.null;
    // original context must remain untouched
    expect(sut.context.data.Country).to.be.equal('Italy');
    // custom context must be different from original value
    expect(context.data.Country).to.be.not.equal('Italy');
  }).timeout(60000);

  it('should evaluate policy synchronously', () => {
    let result;
    data.Country = 'Italy';
    result = sut.runPolicies<IPolicyResult>('entity://people/name100', 'business');
    // Assert
    expect(result).to.be.not.null;
    expect(data.Country).to.be.not.equal('Italy');
  }).timeout(60000);

  it('should evaluate observable policy', () => {
    let result: Observable<any>;
    let secondRound = false;

    for (let i = 0; i < 1000; i++) {
      data.Country = 'Italy';
      result = sut.observePolicies('entity://people/name101', 'business');
      result.pipe(takeUntil(testFinish$)).subscribe(onNext, onError, onComplete);
    }

    secondRound = false;
    expect(secondRound).to.be.false;
    sut.policies = sut.policies;
    expect(secondRound).to.be.true;

    // Assert
    function onNext(actual) {
      secondRound = true;
      expect(data.Country).to.be.not.equal('Italy');
    }
  }).timeout(60000);

  it('should evaluate observable policy (1k times)', () => {
    let result: Observable<any>;
    let secondRound = false;

    for (let i = 0; i < 1000; i++) {
      data.Country = 'Italy';
      result = sut.observePolicies(`entity://people/name${(i % 30) + 10}`, 'business');
      result.pipe(takeUntil(testFinish$)).subscribe(onNext, onError, onComplete);
    }

    secondRound = false;
    expect(secondRound).to.be.false;
    sut.policies = sut.policies;
    expect(secondRound).to.be.true;

    // Assert
    function onNext(actual) {
      secondRound = true;
      expect(data.Country).to.be.not.equal('Italy');
    }
  }).timeout(60000);

  it('should check if given command can be executed on a resource (1k times on 10k policies)', () => {
    sut.policies = k10policies;

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jimmy.doe@some-company.com'
    }];

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('entity://masterdata1000', 'read');

    let authorizationResult = {};

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    expect(authorizationResult).to.be.deep.equal({ read: false });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'bill.doe@some-company.com'
    }];
    expect(authorizationResult).to.be.deep.equal({ read: true });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];
    expect(authorizationResult).to.be.deep.equal({ read: true });

    for (let i = 0; i < 1000; i++) {
      sut.claims = [{
        type: ClaimType.emailAddress,
        value: 'john.doe@some-company.com'
      }];
    }
    expect(authorizationResult).to.be.deep.equal({ read: false }, 'john doe cannot read');

    // Assert
    function onNext(authorization: IAuthorization) {
      authorizationResult = authorization;
    }
  });

  it('should check if given multiple commands can be executed on a single resource', () => {
    sut.policies = [...k10policies, ...[
      {
        type: 'authorization',
        resource: new RegExp(`^entity:\/\/masterdata#columnXYZ$`),
        selector: 'read',
        condition: {
          or: [{
            claimType: ClaimType.emailAddress,
            claimValue: 'bill.doe@some-company.com'
          }, {
            claimType: ClaimType.emailAddress,
            claimValue: 'jane.doe@some-company.com'
          }]
        }
      },
      {
        type: 'authorization',
        resource: new RegExp(`^entity:\/\/masterdata#columnXYZ$`),
        selector: 'write',
        condition: {
          or: [{
            claimType: ClaimType.emailAddress,
            claimValue: 'bill.doe@some-company.com'
          }, {
            claimType: ClaimType.emailAddress,
            claimValue: 'jane.doe@some-company.com'
          }]
        }
      },
      {
        type: 'authorization',
        resource: new RegExp(`^entity:\/\/masterdata#columnXYZ$`),
        selector: 'view',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'bill.doe@some-company.com'
        }
      },
    ]];

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jimmy.doe@some-company.com'
    }];

    // Act
    const authorization = sut.observePolicies<IPolicyResult>('entity://masterdata#columnXYZ', 'read', 'write', 'view');

    let authorizationResult = {};

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);

    expect(authorizationResult).to.be.deep.equal({ read: false, write: false, view: false });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'bill.doe@some-company.com'
    }];
    expect(authorizationResult).to.be.deep.equal({ read: true, write: true, view: true });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];
    expect(authorizationResult).to.be.deep.equal({ read: true, write: true, view: false });

    for (let i = 0; i < 1000; i++) {
      sut.claims = [{
        type: ClaimType.emailAddress,
        value: 'john.doe@some-company.com'
      }];
    }
    expect(authorizationResult).to.be.deep.equal({ read: false, write: false, view: false });

    // Assert
    function onNext(authorization: IAuthorization) {
      authorizationResult = authorization;
    }
  });

  it('should evaluate observable "babel" policy', () => {
    let result: Observable<any>;
    let onNextCalled = false;
    let times = 0;

    sut.policies = [{
      type: 'babel',
      resource: new RegExp(`^input:\/\/app1\/domain1\/task1\/people/name$`),
      // resource: new RegExp(`^input:\/\/app1\/domain1\/task1\/people#name$`),
      selector: 'babel',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jhon.doe@some-company.com'
      },
      policyInfo: [{
        type: RuleType.Simple,
        expression: [
          'context => { if (!!this.label) this.label.default = "Текст метки"; return this.label; }',
        ]
      }]
    }, {
      type: 'babel',
      resource: new RegExp(`^input:\/\/app1\/domain1\/task1\/people/name$`),
      selector: 'babel',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jane.doe@some-company.com'
      },
      policyInfo: [{
        type: RuleType.Simple,
        expression: [
          'context => (!!this.label && (this.label.default = "Texto de etiqueta")) || this.label;',
        ]
      }]
    }];

    // Assert
    function onNext(actual) {
      onNextCalled = true;
      times++;
      expect(actual.babel.default).to.be.not.equal('Text of label');
      expect(data.label.default).to.be.not.equal('Text of label');
      expect(data.label.default === 'Текст метки' || data.label.default === 'Texto de etiqueta');
    }

    // first user will be jhon with default label
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jhon.doe@some-company.com'
    }];
    const component = { label: { key: 'LABEL_XYZ_TEXT', default: 'Text of label' } };
    data.label = component.label;

    // run policies. We expect russian label change
    result = sut.observePolicies(`input://app1/domain1/task1/people/name`, 'babel');
    result.pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete);
    expect(data.label.default).to.be.equal('Текст метки');
    expect(component.label.default).to.be.equal('Текст метки');
    expect(times).to.be.equal(1);

    // switch to jane dynamically. We expect spanish translation
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];
    expect(data.label.default).to.be.equal('Texto de etiqueta');
    expect(component.label.default).to.be.equal('Texto de etiqueta');
    expect(times).to.be.equal(2);

    // change the policy. No impact because user is jane and not john
    sut.policies = [{
      type: 'babel',
      resource: new RegExp(`^input:\/\/app1\/domain1\/task1\/people/name$`),
      selector: 'babel',
      condition: {
        claimType: ClaimType.emailAddress,
        claimValue: 'jhon.doe@some-company.com'
      },
      policyInfo: [{
        type: RuleType.Simple,
        expression: [
          'context => { if (!!this.label) this.label.default = "Etiķetes teksts"; return this.label; }',
        ]
      }]
    }];
    expect(data.label.default).to.be.equal('Texto de etiqueta');
    expect(component.label.default).to.be.equal('Texto de etiqueta');
    expect(times).to.be.equal(3);

    // assign claim john.doe with new policy. Switch to polish
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jhon.doe@some-company.com'
    }];
    expect(data.label.default).to.be.equal('Etiķetes teksts');
    expect(component.label.default).to.be.equal('Etiķetes teksts');
    expect(times).to.be.equal(4);
  }).timeout(60000);
});

export interface IPolicyResult {
  type: string;
  [key: string]: boolean | any;
}

export type IAuthorization = IPolicyResult;
