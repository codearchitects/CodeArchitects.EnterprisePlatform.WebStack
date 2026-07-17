import { expect } from 'chai';

import { ClaimWrapper, IJsonClaim, IJsonClaimProperty } from './claim-wrapper';
import { IClaim } from './core';
import { ClaimType } from './claim-type';

describe('ClaimWrapper', () => {

  it('should exists', () => {
    // Assert
    expect(ClaimWrapper).to.exist;
  });

  it('should wrap an empty claim array', () => {
    // Arrange
    const fixture = JsonClaimBuilder.start()
      .build();

    // Act
    const actual: IClaim[] = ClaimWrapper.wrapJsonClaims(fixture);
    const expected: IClaim[] = ClaimBuilder.start()
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it('should wrap a claim array', () => {
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
    const actual: IClaim[] = ClaimWrapper.wrapJsonClaims(fixture);
    const expected: IClaim[] = ClaimBuilder.start()
      .addClaims(claim1, claim2)
      .build();

    // Assert
    expect(actual).to.deep.equal(expected);
  });
});

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
