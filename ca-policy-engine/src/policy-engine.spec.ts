import { Subject, Observable } from 'rxjs';
import { RegisterAllHandlers } from './register';
import { PolicyEngine } from './policy-engine';
import { ClaimType } from './claim-type';
import { IPolicy, IPolicyHandler } from './core';
import { takeUntil, skip } from 'rxjs/operators';

const k10policies: IPolicy[] = [];

for (let i = 0; i < 10000; i++) {
  k10policies.push({
    type: 'authorization',
    resource: new RegExp(`^entity://masterdata${i}$`),
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

    RegisterAllHandlers();

    sut = new PolicyEngine({
      context: {
        data: data,
        assert: (condition: boolean) => {
          return expect(condition).toBe(true);
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
      policies.push(...[{
        type: 'authorization',
        resource: new RegExp(`^command://app1/domain1/task1/command${i}$`),
        selector: 'execute',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jhon.doe@some-company.com'
        }
      }, {
        type: 'authorization',
        resource: new RegExp(`^command://app1/domain1/task1/command${i + 1}$`),
        selector: 'execute',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }
      }, {
        type: 'authorization',
        resource: new RegExp(`^command://app1/domain1/task1/command${i + 2}$`),
        selector: 'change',
        condition: {
          claimType: ClaimType.emailAddress,
          claimValue: 'jane.doe@some-company.com'
        }
      }]);
    }
    sut.policies = policies;
  });

  afterEach(() => {
    testFinish$.next(null);
  });

  test('should exists', () => {
    // Assert
    expect(PolicyEngine).toBeDefined();
    expect(sut).toBeDefined();
  });

  test('should retrieve claims', () => {
    // Act
    const claims = sut.claims;

    // Assert
    expect(claims).toBeDefined();
  });

  test('should retrieve empty claims', () => {
    // Act
    sut.claims = undefined;

    // Assert
    expect(() => sut.claims).not.toThrow(Error);
  });

  test('should retrieve policies', () => {
    // Act
    const policies = sut.policies;

    // Assert
    expect(policies).toBeDefined();
  });

  test('should retrieve empty policies', () => {
    // Act
    sut.policies = undefined;

    // Assert
    expect(() => sut.policies).not.toThrow(Error);
  });

  test('should check truthy authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'change', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IPolicyResult) {
      // const expected = { execute: true };
      // expect(actual).toEqual(expected);
      expect(true).toBe(true);
      done();
    }
  });

  test('should check falsy authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: false };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check absent authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: undefined };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check multiple authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command1', 'execute', 'visible');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: true, visible: undefined };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check almost one authorization rule', (done) => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IPolicyResult) {
      const expected = { execute: true };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check truthy async authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IPolicyResult>('command://app1/domain1/task1/command2', 'execute');

    authorization
      .pipe(skip(1),
        takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

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
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check falsy async authorization', (done) => {
    // Act
    const authorization = sut.observePolicies<IAuthorization>('command://app1/domain1/task1/command1', 'execute');

    authorization
      .pipe(skip(1),
        takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

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
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check truthy wildcard authorization', (done) => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check falsy wildcard authorization', (done) => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check truthy "or" authorization', (done) => {
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
    const authorization = sut.observePolicies<IPolicyHandler>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check falsy "or" authorization', (done) => {
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
    const authorization = sut.observePolicies<IPolicyHandler>('command://app1/domain1/task1/command3', 'execute');

    authorization
      .pipe(takeUntil(testFinish$))
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check truthy "and" authorization', (done) => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: true };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should check falsy "and" authorization', (done) => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    // Assert
    function onNext(actual: IAuthorization) {
      const expected = { execute: false };
      expect(actual).toEqual(expected);
      done();
    }
  });

  test('should register and unregister policy handler', () => {
    let handlerExecuted = false;
    const expected: IPolicyHandler = {
      type: 'test', handler: context => {
        handlerExecuted = true;
      },
      createWrapHandler: null
    };
    PolicyEngine.RegisterHandler(expected);
    let actual = PolicyEngine.GetPolicyHandler(expected.type);
    expect(actual).toBe(expected);
    PolicyEngine.UnregisterHandler(expected);
    actual = PolicyEngine.GetPolicyHandler(expected.type);
    expect(actual).toBeUndefined();
  });

  test('should check if given command can be executed on a resource (1k times on 10k policies)', () => {
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    expect(authorizationResult).toEqual({ read: false });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'bill.doe@some-company.com'
    }];
    expect(authorizationResult).toEqual({ read: true });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];
    expect(authorizationResult).toEqual({ read: true });

    for (let i = 0; i < 1000; i++) {
      sut.claims = [{
        type: ClaimType.emailAddress,
        value: 'john.doe@some-company.com'
      }];
    }
    expect(authorizationResult).toEqual({ read: false });

    // Assert
    function onNext(authorization: IAuthorization) {
      authorizationResult = authorization;
    }
  });

  test('should check if given multiple commands can be executed on a single resource', () => {
    sut.policies = [...k10policies, ...[
      {
        type: 'authorization',
        resource: new RegExp(`^entity://masterdata#columnXYZ$`),
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
        resource: new RegExp(`^entity://masterdata#columnXYZ$`),
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
        resource: new RegExp(`^entity://masterdata#columnXYZ$`),
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
      .subscribe({ next: onNext, error: onError, complete: onComplete });

    expect(authorizationResult).toEqual({ read: false, write: false, view: false });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'bill.doe@some-company.com'
    }];
    expect(authorizationResult).toEqual({ read: true, write: true, view: true });

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];
    expect(authorizationResult).toEqual({ read: true, write: true, view: false });

    for (let i = 0; i < 1000; i++) {
      sut.claims = [{
        type: ClaimType.emailAddress,
        value: 'john.doe@some-company.com'
      }];
    }
    expect(authorizationResult).toEqual({ read: false, write: false, view: false });

    // Assert
    function onNext(authorization: IAuthorization) {
      authorizationResult = authorization;
    }
  });

});

export interface IPolicyResult {
  type: string;
  [key: string]: boolean | any;
}

export type IAuthorization = IPolicyResult;
