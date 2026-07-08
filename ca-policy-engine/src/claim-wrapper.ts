import { IClaim } from './core';

export interface IJsonClaimProperty {
  [key: string]: string;
}

export interface IJsonClaim {
  properties: IJsonClaimProperty;
  type: string;
  issuer: string;
  originalIssuer: string;
  valueType: string;
  value: string;
}

export class ClaimWrapper {
  static wrapJsonClaims(jsonClaims: IJsonClaim[]): IClaim[] {
    return jsonClaims.map(ClaimWrapper.wrapJsonClaim);
  }

  private static wrapJsonClaim(jsonClaim: IJsonClaim): IClaim {
    return {
      type: jsonClaim.type,
      value: jsonClaim.value
    };
  }
}
