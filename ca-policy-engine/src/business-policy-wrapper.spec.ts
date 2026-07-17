import { expect } from 'chai';
import { PolicyWrapper, PolicyWrapperHelper } from './policy-wrapper';
import { IPolicy } from './core';

import { RegisterAllHandlers } from './register';
import { JsonPolicyBuilder } from './policy-wrapper.spec';
import { Subject } from 'rxjs';
import { PolicyEngine } from './policy-engine';
import { ClaimType } from './claim-type';
import { takeUntil } from 'rxjs/operators';

RegisterAllHandlers();

describe('PolicyWrapper', () => {
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

  });

  it('should exists', () => {
    // Assert
    expect(PolicyWrapper).to.exist;
  });

  it('should wrap and execute a business policy', () => {
    let times = 0;

    function onNext(actual) {
      times++;
    }

    // Arrange
    let jsonString = `
    [
      {
        "type": "babel",
        "resource": "input://app1/domain1/*/people/name1",
        "selector": "babel",
        "condition": {
          "claim": {
            "claimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
            "claimValue": "jhon.doe@some-company.com"
          }
        },
        "policyInfo": [
          {
            "type": "Simple",
            "expression": [
              "context => { if (!!this.label) this.label.default = 'Etiķetes teksts'; return this.label; }"
            ]
          }
        ]
      }
    ]
    `;
    let jsonData = JSON.parse(jsonString);

    let fixture = JsonPolicyBuilder.start().build();
    fixture.claimsAuthorizationPolicyManager.policy = jsonData;
    const component = { label: { key: 'LABEL_XYZ_TEXT', default: 'Text of label' } };
    data.label = component.label;

    // Act
    const policies: IPolicy[] = PolicyWrapperHelper.wrapJsonPolicies(fixture);

    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jhon.doe@some-company.com'
    }];
    sut.policies = policies;

    const result = sut.observePolicies(`input://app1/domain1/test/people/name1`, 'babel');
    result.pipe(takeUntil(testFinish$))
      .subscribe(onNext, onError, onComplete)
      ;

    // Assert
    expect(data.label.default).to.be.equal('Etiķetes teksts');
    expect(component.label.default).to.be.equal('Etiķetes teksts');
    expect(times).to.be.greaterThan(0);

    // Act
    component.label.default = 'Text of label';
    expect(data.label.default).to.be.equal('Text of label');
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jane.doe@some-company.com'
    }];

    // Assert
    expect(data.label.default).to.be.equal('Text of label');

    // Act
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jhon.doe@some-company.com'
    }];
    // Assert
    expect(data.label.default).to.be.equal('Etiķetes teksts');

    jsonString = `
    [
      {
        "type": "babel",
        "resource": "input://app1/domain1/*/people/name1",
        "selector": "babel",
        "condition": {
          "or": {
            "claim": [
              {
                "claimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                "claimValue": "jim.doe@some-company.com"
              },
              {
                "claimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                "claimValue": "jonathan.doe@some-company.com"
              }
            ]
          }
        },
        "policyInfo": [
          {
            "type": "Simple",
            "expression": [
              "context => { debugger; if (!!this.label) this.label.default = 'Etiķetes teksts'; return this.label; }"
            ]
          }
        ]
      }
    ]
    `;

    jsonData = JSON.parse(jsonString);

    fixture = JsonPolicyBuilder.start().build();
    component.label.default = 'Text of label';
    expect(data.label.default).to.be.equal('Text of label');

    fixture.claimsAuthorizationPolicyManager.policy = jsonData;
    sut.policies = PolicyWrapperHelper.wrapJsonPolicies(fixture);

    expect(data.label.default).to.be.equal('Text of label');
    // Act
    sut.claims = [{
      type: ClaimType.emailAddress,
      value: 'jonathan.doe@some-company.com'
    }];

    // Assert
    expect(data.label.default).to.be.equal('Etiķetes teksts');
  });
});
